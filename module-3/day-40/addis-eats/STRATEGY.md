# Rendering Strategy

Written BEFORE the build, checked AFTER it. `npm run verify` compares the **Marker** column
with the production build automatically: `○` static, `●` prerendered from params, `ƒ` dynamic.

Two questions for every route: *who is asking?* and *how stale may it be?*

| Route              | Marker | Strategy                    | Why (one sentence)                                                                 |
|--------------------|--------|-----------------------------|------------------------------------------------------------------------------------|
| `/`                | ○      | Static                      | Nobody in particular is asking, and specials only need to be as fresh as the last build. |
| `/menu`            | ○      | ISR, `revalidate = 3600`    | Dishes change a few times a day; an hour-old menu misleads nobody and speed matters most. |
| `/menu/[id]`       | ●      | Static via `generateStaticParams` | Every dish id is known at build time; ids added later render on demand and are cached. |
| `/cart`            | ○      | Client (static shell + client leaf) | The cart is private to this browser tab and never leaves it until checkout; the page around it is static. |
| `/checkout`        | ƒ      | Dynamic (`force-dynamic`)   | Depends on who is asking: it reads the session (`getSession()`, a cookie read once real sessions arrive). |
| `/orders`          | ƒ      | Dynamic (`force-dynamic`)   | Each person must see only their own orders, so it can never be shared between visitors. |
| `/api/dishes`      | ƒ      | Dynamic route handler       | Reads `request.url` for the `?category=` filter. |
| `/api/dishes/[id]` | ƒ      | Dynamic route handler       | Params-based; a missing dish must answer 404 at request time. |
| `/api/orders`      | ƒ      | Dynamic route handler       | A POST: writes are never cached. |
| `/api/orders/[id]` | ƒ      | Dynamic route handler       | Depends on who is asking (session + ownership check). |

## A route I changed my mind about

**`/` (landing page).** The brief says static, and the first draft was: "specials rotate every
day, so make it ISR (`revalidate = 86400`)". Writing the one-sentence justification showed the
rotation does not exist yet (the specials are the first two available dishes), so static is the
honest answer. If specials ever rotate, add `export const revalidate = 86400;` and change the
row. (Replace this paragraph with your own change of mind before you present.)

## Known consequence of `loading.js` on a not-found dish

`/menu/not-a-dish` renders the not-found page and Next.js adds `noindex`, but the HTTP status is
`200`, because `loading.js` has already streamed the shell before `notFound()` runs. This matters
for SEO (Day 44), not for the user.
