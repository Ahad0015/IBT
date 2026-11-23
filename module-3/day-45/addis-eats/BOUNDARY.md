# Server and client boundary: Addis Eats

Every component, which side it runs on, and why. Everything is a server component unless it needs state,
effects or event handlers, and `"use client"` sits on the smallest leaf that needs it.

| Component | Runs on | Why |
|---|---|---|
| `app/layout.js` | Server | Static shell (html, body, font, header, footer); needs no state. |
| `app/providers.js` | Client | Holds the cart state with `useState` and Context, which need the browser. |
| `app/AuthNav.js` | Client | Shows who is signed in with SWR on `/api/me` and handles sign-out. Reading the cookie in the root layout instead would make every route dynamic. |
| `app/GoogleAnalytics.js` | Server | Renders `next/script` (`lazyOnload`); the script component handles the browser side, so no directive is needed. |
| `app/actions.js` | Server | `"use server"`: validation, session and owner checks, and writes. Public endpoints, so every check lives inside. |
| `app/page.js` | Server | Static home page with the preloaded hero image. |
| `app/menu/layout.js` | Server | Arranges the sidebar and the content; persists across `/menu` and `/menu/[id]`. |
| `app/menu/page.js` | Server | Async: awaits the dishes directly, no hooks; seeds the search with the first page. |
| `app/menu/DishList.js`, `DishCard.js` | Server | Only render data. `DishList` is passed into `FilterShell` as `children`, so its code stays out of the browser. |
| `app/menu/CategoryBar.js` | Client | `useState` and `onClick` for the active category (it highlights the choice; it does not filter yet). |
| `app/menu/FilterShell.js` | Client | Holds the "vegetarian only" toggle; wraps server content through `children`. |
| `app/menu/SearchBox.js` | Client | Typing triggers requests: debounce, SWR key, seeded with server data. |
| `app/menu/error.js` | Client | Next.js requires error boundaries to be client components. |
| `app/menu/[id]/page.js` | Server | Reads params and the dish on the server; builds the metadata and the JSON-LD. |
| `app/checkout/page.js` | Server | Reads the session on the server and redirects if signed out. |
| `app/checkout/OrderForm.js` | Client | `useActionState` for the pending flag and field errors. |
| `app/signin/page.js` | Server | Reads the session and the sanitised `next`. |
| `app/signin/SignInForm.js` | Client | `useActionState` for the pending flag and the error message. |
| `app/orders/page.js` | Server | Reads the session and the user's orders on the server. |
| `app/orders/CancelButton.js` | Client | `useActionState` to show the result of the cancel action. |
| `app/orders/[id]/page.js` | Server | Checks ownership and renders the first status. |
| `app/orders/[id]/OrderStatus.js` | Client | Polls `/api/orders/[id]` every 5 s with SWR, seeded with the server's order. |
| `app/kitchen/page.js` | Server | Staff only; the role is checked on the server. |
| `app/api/**/route.js`, `proxy.js` | Server | HTTP endpoints and the cookie check; no UI. |
| `app/sitemap.js`, `robots.js`, `**/opengraph-image.jsx` | Server | Generated from the real dish data. |
| `lib/*.js` | Server | Schema, session, users, store and helpers. Shared with the browser only by a client file that imports them: `search.js` and `fetcher.js` are the two client-safe ones. |

## "use client" count

Ten files: `providers.js`, `AuthNav.js`, `CategoryBar.js`, `FilterShell.js`, `SearchBox.js`, `error.js`,
`SignInForm.js`, `OrderForm.js`, `CancelButton.js`, `OrderStatus.js`. Each is a leaf that needs state, an event
handler or a timer. No page or layout carries `"use client"`. Check with:

```
grep -rl "use client" src
```

## First Load JS for /menu

Measured in Chrome DevTools, Network tab, JS filter, cache disabled, on `npm run start`:

- Before (Day 38 comparison): 661 kB
- After: 663 kB

The two numbers are almost the same because the shared React and Next.js runtime dominates the total; the
interactive leaves added only about 2 kB. The page, `DishList`, `DishCard` and the data stay on the server.
(Re-measure after the Day 41 to 45 additions and write the new figure in your own words.)
