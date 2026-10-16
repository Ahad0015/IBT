# Addis Eats on Next.js (Day 40 foundations project)

The Day 35 food-ordering app rebuilt on Next.js 16 (App Router): file routing, nested layouts,
a rendering strategy per route, server components that fetch their own data, and its own
endpoints and server actions in the same repository.

## Run it

```bash
npm install
npm run build && npm run start      # present from the production build, not `dev`
npm run verify                      # in another terminal: mechanical checks
```

## Requirements → where they are

| From day | Requirement | Where |
|----------|-------------|-------|
| 36 | Folder routing, dynamic segment, loading and error files | `app/**`, `app/menu/[id]`, `app/menu/loading.js`, `app/menu/error.js`, `app/orders/loading.js`, `app/not-found.js` |
| 37 | Nested layouts, a justified strategy for every route | `app/layout.js`, `app/menu/layout.js`, `STRATEGY.md` |
| 38 | Server components fetch data; `"use client"` on leaves only | `app/menu/page.js`, `BOUNDARY.md` |
| 39 | A route handler, a server action, server-side validation | `app/api/**/route.js`, `app/actions.js`, `lib/schema.js` |
| Earlier | Cart, form, guard | `app/providers.jsx`, `app/cart/CartView.jsx`, `app/checkout/**` |

## Routes

| Route | Marker | What it does |
|-------|--------|--------------|
| `/` | ○ | Landing page with today's specials |
| `/menu` | ○ (ISR 1h) | Fetched dishes, filter, category sidebar |
| `/menu/[id]` | ● | One dish, add to order, reviews |
| `/cart` | ○ | Order lines and the running ETB total (client) |
| `/checkout` | ƒ | Server action, validated, guarded |
| `/orders` | ƒ | My orders, cancel (server action) |

## Endpoints and status codes

| Method | Path | Success | Errors |
|--------|------|---------|--------|
| GET | `/api/dishes` (`?category=`) | 200 | |
| GET | `/api/dishes/[id]` | 200 | 404 |
| POST | `/api/orders` | 201 | 400 not JSON, 401 not signed in, 422 validation, 500 |
| GET | `/api/orders/[id]` | 200 | 401, 403 not yours, 404 |

Every error has one shape: `{ "error": "message", "fieldErrors": { "field": ["message"] } }`.

```bash
curl -i localhost:3000/api/dishes/not-a-dish
# HTTP/1.1 404  {"error":"No such dish"}

curl -i -X POST localhost:3000/api/orders -H "Content-Type: application/json" \
  -d '{"name":"Almaz","phone":"0912","dishId":"dish_1"}'
# HTTP/1.1 422  {"error":"Validation failed","fieldErrors":{"name":[...],"phone":["Phone number must start with 09… or +2519… followed by 8 digits"]}}
```

## Who calls what (data movement)

| What | How | Why that one |
|------|-----|--------------|
| Menu, dish and specials data | Server components read `lib/db.js` directly | Read to render: no endpoint needed |
| Placing and cancelling an order | Server actions | A write from our own UI |
| Cart contents | Client store only | Never leaves the browser until checkout |
| `/api/dishes`, `/api/orders` | Route handlers | **Nothing in our own pages calls them.** They exist for callers we do not control (curl, a mobile app, a payment or status poller) and to prove the contract. Our pages read the data directly. |
| Order status polling | Would be a client fetch to `/api/orders/[id]` | Arrives with SWR on Day 41 |

## Verification

`npm run verify` checks, against the production build and a running server: the directive search,
`STRATEGY.md` against the build markers, a secret search of the browser bundle, the endpoint
contract, and the server action with no JavaScript. `npm run size` prints approximate First Load JS.
The six manual failure checks are in `docs/VERIFY.md`.

## Build output

Paste your own `npm run build` output here before you submit. This is the reference build:

```
Route (app)           Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ƒ /api/dishes
├ ƒ /api/dishes/[id]
├ ƒ /api/orders
├ ƒ /api/orders/[id]
├ ○ /cart
├ ƒ /checkout
├ ○ /menu                     1h      1y
├   /menu/[id]
│ ├ ● /menu/dish_1
│ ├ ● /menu/dish_2
│ ├ ● /menu/dish_3
│ └ ● /menu/dish_4
└ ƒ /orders

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

## Notes

- Data is in memory (`lib/db.js`); restarting the server empties the orders (except the seeded `ord_900`).
- The session is a mock user; real sessions arrive on Day 42.
- Documents: `STRATEGY.md`, `BOUNDARY.md`, `docs/`.
