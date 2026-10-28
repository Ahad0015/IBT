# Authentication: Addis Eats

Written before the code, then checked against it. Three layers protect the private routes, and each
layer proves something different. Nothing is protected by hiding a button.

## The three layers

| Layer | Where | What it proves | What it does NOT prove |
|---|---|---|---|
| 1. Proxy | `src/proxy.js` (matcher: `/checkout/*`, `/orders/*`) | A cookie named `session` exists | That the cookie is valid, unexpired or belongs to anyone |
| 2. Session | `getSession()` in every page, action and handler | The id is in the server's session store, not expired, and the user still exists. The role comes from the server's user record | That this user may touch *this* record |
| 3. Ownership / role | Inside the action, handler or query that reads or writes | The order belongs to `session.userId`, or `session.role === "staff"` | Nothing further; this is the last check before data moves |

Layer 1 is a convenience (a fast, visible redirect). Layers 2 and 3 are the security. A forged cookie gets
through layer 1 and is stopped by layer 2.

## Route table

| Route / surface | Who may use it | Layer 1 proxy | Layer 2 session | Layer 3 ownership / role |
|---|---|---|---|---|
| `/signin` | anyone (signed-in visitors are sent on) | no | page reads the session and redirects if signed in | `next` sanitised by `safeNext()` on the page and again in the action |
| `/checkout` | signed in | yes | page redirects to `/signin?next=/checkout` | the `placeOrder` action checks again |
| `/orders` | signed in | yes | page redirects | query filtered to `session.userId` |
| `/orders/[id]` | the order's owner | yes | page redirects | 404 unless `order.userId === session.userId` |
| `/kitchen` | staff only | no (page-level) | page redirects | `session.role !== "staff"` gives 404 |
| `GET /api/orders/[id]` | the order's owner | n/a | 401 if no session | 403 if not the owner, 404 if no such order |
| `POST /api/orders` | signed in | n/a | 401 if no session | `userId` always comes from the session, never the body |
| `GET /api/me` | anyone | n/a | returns `{ user: null }` when signed out | role comes from the server record |
| action `signIn` | anyone | n/a | none (this creates the session) | generic error message; `next` re-sanitised |
| action `signOut` | anyone | n/a | none | deletes the session on the server and clears the cookie |
| action `placeOrder` | signed in | n/a | returns "Please sign in" | `userId` from the session; the form cannot set it |
| action `cancelOrder` | the order's owner | n/a | returns "must be signed in" | owner check, and a finished order cannot be cancelled |

`/kitchen` is not in the proxy matcher on purpose: the page does its own check, and a customer gets a 404,
not a 403, so the page does not announce that a staff area exists.

## The session

- Cookie `session`: a random 64-hex-character id (`randomBytes(32)`), new on every sign-in.
- Flags: `HttpOnly` (page JavaScript cannot read it), `Secure` in production, `SameSite=lax`, `Max-Age` 8 hours.
- The cookie holds only the id. The user and the **role** are looked up on the server, so editing the cookie
  cannot make anyone staff.
- Passwords are never stored: `scrypt` with a per-user salt, compared with `timingSafeEqual`. An unknown email
  does the same hashing work, so response time does not reveal which emails exist.

## Attacks

Each attack was run against a production build (`npm run build && npm run start`). The HTTP attacks are
repeatable with `npm run attacks`; the action-level attacks were run by calling the action functions directly
with controlled cookies. Re-run both and paste your own output if anything changes.

### Attack 1: act while signed out

| Attempt | Result | What stopped it |
|---|---|---|
| `POST /api/orders` with no cookie | 401 | layer 3: `getSession()` in the handler |
| `GET /api/orders/[id]` with no cookie | 401 | layer 3 |
| `GET /checkout`, `/orders`, `/orders/[id]` with no cookie | 307 to `/signin?next=...` | layer 1: proxy |
| `GET /orders` with a **forged** cookie | 307 to `/signin?next=/orders` | layer 1 let it through; layer 2 rejected it |
| `placeOrder` with no cookie | "Please sign in to place an order." | layer 2 inside the action |
| `cancelOrder` with no cookie | "You must be signed in to cancel an order." | layer 2 inside the action |
| `placeOrder` with a forged cookie | "Please sign in to place an order." | layer 2 |

### Attack 2: act as someone else

| Attempt | Result | What stopped it |
|---|---|---|
| Dawit reads Hana's order via the API | 403 | layer 3: ownership check |
| Dawit opens Hana's order page | 404 | layer 3 (404 so it does not confirm the order exists) |
| Dawit's `/orders` list | Hana's order is absent | the query is scoped to the session id |
| Dawit calls `cancelOrder` on Hana's order | "You can only cancel your own orders." Order unchanged | layer 3 inside the action |
| Hana's form also sends `userId=u2` and `status=delivered` | order saved with `userId: u1`, `status: placed` | the action builds the record from the session and the validated fields only |
| Hana (customer) opens `/kitchen` | 404 | layer 3: role from the server record |
| Hana cancels her own *delivered* order | "This order is already delivered." | the rule is enforced in the action, not only by hiding the button |

### Attack 3: a crafted sign-in link

| Attempt | Result | What stopped it |
|---|---|---|
| `/signin?next=https://evil.example` | form carries `/`; a tampered post redirects to `/` | `safeNext()` on the page |
| `next=//evil.example`, `/\evil.example`, `javascript:alert(1)` | all end at `/` | `safeNext()` again in the action (a hidden field can be edited) |
| `next=/orders` | returns to `/orders` | the legitimate case still works |

## Known gaps (honest list)

- **Sessions, users and orders live in server memory** (`globalThis`). They disappear when the server restarts,
  and they are **not shared between server instances**. On a platform that runs several copies or cold-starts
  (serverless), a sign-in can land on one copy and the next request on another, which looks like random sign-outs.
  Deploy to a single long-running Node process, or move sessions and data to a database.
- No rate limiting on sign-in, so passwords can be guessed at full speed.
- No registration, password reset or CSRF token beyond `SameSite=lax` and Next.js's own origin check on server actions.
- Demo accounts with known passwords are listed on the sign-in page. Remove that line for a real deployment.
