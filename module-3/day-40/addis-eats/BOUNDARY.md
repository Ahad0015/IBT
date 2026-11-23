# Server / Client Boundary

Rule: server by default; `"use client"` only on the smallest leaf that needs state, an event
handler or a browser API; server content enters client shells as `children`, never imported.

Checked mechanically: `grep -rl "use client" app components` (and `npm run verify`).

## Every component, which side, and why

| Component                       | Runs on | Why                                                                      |
|---------------------------------|---------|--------------------------------------------------------------------------|
| `app/layout.js`                 | Server  | Passes `children` into `Providers`, imports nothing client-side          |
| `app/providers.jsx`             | Client  | React context needs state (`useReducer`)                                 |
| `components/Header.js`          | Server  | Static links and markup                                                  |
| `components/CartCount.jsx`      | Client  | Reads cart context to show the item count                                |
| `components/Footer.js`          | Server  | Static markup                                                            |
| `app/page.js`                   | Server  | Reads dishes for the specials; no interactivity                          |
| `app/menu/layout.js`            | Server  | Static kitchen-hours banner; persists across `/menu` and `/menu/[id]`    |
| `app/menu/page.js`              | Server  | Awaits dishes; no interactivity of its own                               |
| `app/menu/FilterShell.jsx`      | Client  | Holds the selected category, handles clicks; receives the list as `children` |
| `app/menu/DishList.jsx`         | Server  | Pure markup from data; ships no JavaScript                               |
| `app/menu/AddToCartButton.jsx`  | Client  | `onClick`, and writes to the cart store                                  |
| `app/menu/[id]/page.js`         | Server  | Fetches dish and reviews in parallel                                     |
| `app/menu/loading.js`           | Server  | Static skeleton                                                          |
| `app/menu/error.js`             | Client  | Needs an event handler for retry (the framework requires it)             |
| `app/cart/page.js`              | Server  | Heading and layout only                                                  |
| `app/cart/CartView.jsx`         | Client  | Reads and edits the cart                                                 |
| `app/checkout/page.js`          | Server  | Reads the session; renders the client form                               |
| `app/checkout/CheckoutForm.jsx` | Client  | `useActionState` (pending, field errors) and the cart context            |
| `app/orders/page.js`            | Server  | Reads orders and the session; cancel is a server action inside a plain form |
| `app/orders/loading.js`         | Server  | Static skeleton                                                          |
| `app/actions.js`                | Server  | `"use server"`: `placeOrder`, `cancelOrder` (public, so they check session and owner inside) |
| `app/api/**/route.js`           | Server  | HTTP endpoints, no UI                                                    |
| `lib/db.js`                     | Server  | `import "server-only"`: a client import fails the build                  |

## Client components: 7, and the defence for each

The brief's guideline is four or five; this build has seven (two are framework-mandated).

| File | Why it cannot be a server component | Could it go? |
|------|-------------------------------------|--------------|
| `app/providers.jsx` | Context needs state | No: the cart is shared by three leaves |
| `components/CartCount.jsx` | Reads context | Yes, but the header would lose its live count (the cheapest one to drop) |
| `app/menu/FilterShell.jsx` | Selection state | No: filtering without a reload needs state |
| `app/menu/AddToCartButton.jsx` | `onClick` writes to the store | No |
| `app/cart/CartView.jsx` | Edits the cart | No |
| `app/checkout/CheckoutForm.jsx` | `useActionState` for pending and per-field errors | No: this is the progressive form |
| `app/menu/error.js` | Error boundaries must be client components | No: framework rule |

## Composition pairs (client shell wrapping server content)

- `FilterShell` (client) wraps `DishList` (server): passed as `children` from `menu/page.js`.
- `Providers` (client) wraps the whole app: passed as `children` from `layout.js`.

## Where the category sidebar lives, and why

The brief puts a "category sidebar" on `/menu`. It is inside `FilterShell`, not `menu/layout.js`,
because the selection state and the list it filters must share one client boundary. Putting it
in the layout would need context or `searchParams`, and `searchParams` would make `/menu`
dynamic and lose ISR.

## Bundle comparison (/menu)

Next.js 16 no longer prints sizes in the build table, so use `npm run size` (approximate gzip
"First Load JS"; compare numbers from the same tool, before and after).

|                      | First Load JS (/menu) | Notes                                |
|----------------------|-----------------------|--------------------------------------|
| Day 35 (Vite)        | ___ kB                | your Day 35 build                    |
| Today (Next.js)      | ___ kB                | `npm run size` after `npm run build` |

**What moved and why:** (2–3 sentences in your own words.)
