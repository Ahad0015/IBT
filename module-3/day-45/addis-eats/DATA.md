# Data fetching: Addis Eats

Written before the code. Each query says which side runs it, its key, its refresh rule, and why.
Rule used: read to render on the **server**; use the **client** only when the person or the clock triggers
the request again and again.

| Query | Side | Key | Refresh rule | Seeded with | Why |
|---|---|---|---|---|---|
| Menu dishes (`/menu`) | Server | n/a (direct call to `getDishes()`) | ISR: `revalidate = 60` | n/a | Read to render. No endpoint needed, and the HTML is indexable. |
| One dish (`/menu/[id]`) | Server | the `id` param | prebuilt with `generateStaticParams` | n/a | Every dish is known at build time. |
| Orders list (`/orders`) | Server | the session user | dynamic on every request; `revalidatePath("/orders")` after a write | n/a | Per-person data, never shared. |
| Kitchen board (`/kitchen`) | Server | none | dynamic on every request | n/a | Staff only, depends on the session role. |
| **Search** (`SearchBox`) | **Client (SWR)** | `/api/dishes?q=<term>&page=<n>&limit=2` | none automatic: `revalidateOnFocus: false`, `dedupingInterval: 60s`. A new term or page is a new key | the first page of dishes, fetched on the server (`firstPage(dishes)` as `fallbackData`) | Typing triggers the request. Debounced 300 ms so a word is one request, not one per letter. |
| **Order status** (`OrderStatus`) | **Client (SWR)** | `/api/orders/[id]` | polls every 5 s, stops when the order is `delivered` or `cancelled` | the server-rendered order (`fallbackData: initialOrder`) | Repeats over time; the page renders the first value on the server, so there is no spinner on first paint. |
| **Who is signed in** (`AuthNav`) | **Client (SWR)** | `/api/me` | revalidated after every navigation and on focus | none (renders nothing until it knows) | The header sits in the root layout. Reading the cookie there on the server would make **every** route dynamic. |

## Writes

| Write | How | After it |
|---|---|---|
| Place an order | server action `placeOrder` (form, `useActionState`) | `revalidatePath("/orders")` |
| Cancel an order | server action `cancelOrder` | `revalidatePath("/orders")` |
| Sign in / out | server actions `signIn`, `signOut` | `signIn` redirects; `AuthNav` re-reads `/api/me` |
| Any caller outside our UI | route handler `POST /api/orders` | none; it is the public contract |

## Decisions worth defending

- **Seeded, not empty.** Search starts with the server's first page and the status starts with the server's
  order, so neither shows a spinner on first paint. Search is configured to fetch only once the term or page changes
  (`revalidateIfStale: false` while seeded), and the status only polls from then on.
- **Stop rules.** The seeded search view (empty term, page 1) is not refetched on first paint.
  Polling stops when the order is finished: a delivered order does not need a request every 5 seconds forever.
- **The endpoints exist for the client queries.** `/api/dishes` (search) and `/api/orders/[id]` (status) are
  called by the browser. The menu page does **not** call `/api/dishes`; it reads the data directly.
- **Debounce vs. dedupe.** Debounce (300 ms) cuts requests while typing. Deduping (60 s) means searching the same
  term twice reuses the answer.
- **Known limit.** The search shows two dishes per page (`SEARCH_PAGE_SIZE = 2` in `src/lib/search.js`), which
  is small on purpose so the pager is visible with only eight dishes.
