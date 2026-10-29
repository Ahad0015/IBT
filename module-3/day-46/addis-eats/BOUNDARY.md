# Server and client boundary: Addis Eats

Every component, which side it runs on, and why. Everything is a server
component unless it needs state, effects or event handlers, and `"use client"`
sits on the smallest leaf that needs it.

| Component | Runs on | Why |
|---|---|---|
| `app/layout.js` | Server | Static shell (html, body, header, footer); needs no state. |
| `app/providers.js` | Client | Holds the cart state with `useState` and Context, which need the browser. |
| `app/actions.js` | Server | `"use server"`: validation, session and owner checks, and writes. |
| `app/menu/layout.js` | Server | Only arranges the sidebar and the content. |
| `app/menu/page.js` | Server | Async: awaits the dishes directly, no hooks. |
| `app/menu/DishList.js` | Server | Only renders data. It is passed into FilterShell as `children`, so its code stays out of the browser. |
| `app/menu/CategoryBar.js` | Client | Uses `useState` and `onClick`. |
| `app/menu/FilterShell.js` | Client | Holds the "vegetarian only" toggle state; wraps server content through `children`. |
| `app/menu/error.js` | Client | Next.js requires error boundaries to be client components. |
| `app/menu/[id]/page.js` | Server | Reads params and the dish data on the server. |
| `app/checkout/page.js` | Server | Reads cookies on the server. |
| `app/checkout/OrderForm.js` | Client | `useActionState` for the pending flag and field errors. |
| `app/orders/page.js` | Server | Reads the session cookie and the orders on the server. |
| `app/orders/CancelButton.js` | Client | `useActionState` to show the result of the cancel action. |
| `lib/*.js` | Server | Schema, session, store and error helper; never sent to the browser unless a client file imports them (`schema.js` is only imported by server code). |

## "use client" count

Six files: `providers.js`, `CategoryBar.js`, `FilterShell.js`, `error.js`,
`OrderForm.js`, `CancelButton.js`. Each one is a leaf that needs state or an
event handler. No page or layout carries `"use client"`.

## First Load JS for /menu

Measured in Chrome DevTools, Network tab, JS filter, cache disabled, on
`npm run start`:

- Before: 661kB
- After: 663kB

Explanation: (2 or 3 sentences: only the small interactive leaves ship to the
browser; the page, DishList and the data stay on the server.)