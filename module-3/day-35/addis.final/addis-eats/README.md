# Addis Eats

Traditional Ethiopian food ordering app - React + Vite + React Router v6.
Module 3 mini-project (Day 35): composed components, hooks, routing, a Zustand cart, a validated checkout, an error boundary and a lazy route. Planning notes: [`docs/PLAN.md`](docs/PLAN.md).

## Run it

```bash
npm install
npm run dev      # start the app
npm test         # store, validation rules and the order API - all without React
npm run lint
npm run build
```

## The route table

| Path | Screen | Notes |
| --- | --- | --- |
| `/` | `pages/Home.jsx` | index route - landing page with today's specials |
| `/menu` | `menu/Menu.jsx` | category filter lives in the query string: `/menu?category=Meat` |
| `/menu/:id` | `menu/DishDetail.jsx` | `id` is the dish slug, e.g. `/menu/shiro`; unknown slug shows "No dish called ..." |
| `/cart` | `cart/CartPanel.jsx` | current order and total in ETB |
| `/checkout` | `checkout/Checkout.jsx` | **lazy-loaded**; wrapped in `auth/RequireAuth.jsx` - signed in only |
| `/login` | `auth/Login.jsx` | sends the person back to where they were headed |
| `*` | `pages/NotFound.jsx` | catch-all |

All of them are children of `Layout.jsx` (header, nav, `<Outlet />`, footer), which renders once. The outlet sits inside `<ErrorBoundary>` and `<Suspense>`.

## Sign in

Any TeleBirr number works: `09…` or `+2519…`, spaces and dashes allowed (e.g. `0911 234 567`).
The session is kept in `localStorage`.

## Deploying

A routed app needs the host to serve `index.html` for every path (otherwise a refresh on `/menu/shiro` is a 404).
`vite dev` and `vite preview` already do this; on a static host add a rewrite-to-`index.html` rule.

## State: what lives where (Day 32)

| State | Where | Why |
| --- | --- | --- |
| Cart (items) | Zustand store - `src/cart/cartStore.js` | Changes on every click, read by many screens. Selectors mean only the readers re-render. Persisted to `localStorage` (`addis-eats-cart`), so an order survives a refresh. |
| Session (user) | Context - `src/auth/AuthProvider.jsx` + `useAuth` | A single value that changes rarely. |
| Theme | Context - `src/theme/ThemeProvider.jsx` + `useTheme` | Changes almost never, so it gets its own provider and never re-renders with the cart. |
| Category filter | URL query string | Shareable, survives a refresh. |
| Dishes (server data) | `useFetch` | Server data is not application state; Day 41 (SWR / React Query) will own it properly. |

Both contexts are wrapped in hooks that throw a clear error if the provider is missing.

### How the cart is read

```js
const count = useCartStore(selectCount);       // CartBadge: re-renders only when the count changes
const addItem = useCartStore((s) => s.addItem); // Menu, Home, DishDetail: write-only, never re-render for the cart
```

`total` and `count` are *derived in selectors*, never stored, so they cannot disagree with `items`.
Use the React DevTools "highlight updates" option: adding a dish now flashes only the cart badge, not the header.

The devtools middleware is enabled in development only: open the Redux DevTools browser extension to see
`cart/addItem`, `cart/remove` and `cart/clear` as named actions.

### Redux Toolkit comparison (homework)

`src/cart/cartSlice.redux-example.js` is the same cart written with `createSlice`. It is **not** used by the app.

## The checkout form (Day 33)

```
src/checkout/Checkout.jsx   the form: one state object, touched tracking, submit + feedback
src/checkout/validate.js    pure rules: validate(form) -> errors object ({} means valid)
src/checkout/Field.jsx      label + control + hint + error, with the aria wiring
src/api/orders.js           placeOrder(): a pretend endpoint that re-validates and answers 422
```

| Requirement | How it is done |
| --- | --- |
| One source of truth | `useState({ name, phone, area, notes })`; one `handleChange` using `name` + a computed key and the updater form |
| Rules as a pure function | `validate(form)`; errors are **derived** on every render, never stored |
| Humane timing | `touched` set on blur: an error shows once its field was visited, then updates live as it is corrected. A submit attempt marks everything touched |
| Real labels, ARIA | `Field`: `htmlFor`/`id`, `aria-invalid`, `aria-describedby` (hint + error), `role="alert"`, a ⚠ symbol - never colour alone |
| Failed submit | focus moves to the first invalid field (in page order) |
| Cannot double-send | `onSubmit` on the form; `preventDefault`; a ref + state guard; button disabled while sending; a status line for screen readers |
| Total in the button | `Order — 640 ETB`, from the store's `selectTotal` selector |
| Failed request | 422 -> field errors beside their fields; anything else -> a message. **Every value and the cart are kept**; the cart is cleared only on success |

**Disabled, but only for a reason.** The slide's `disabled={submitting || hasErrors}` would disable the button on first load
(an empty name is invalid from render one) with no visible explanation. Here the button is disabled only while sending;
pressing it with problems shows every error and focuses the first one.

**The six states:** pristine (nothing touched) - dirty (`form`) - invalid (derived `errors`) - submitting - failed - succeeded
(clear the cart, `navigate("/", { replace: true })`, confirmation with the order number).

### Trying the states by hand

The pretend API (`src/api/orders.js`) has two demo triggers:

| Phone number | Result |
| --- | --- |
| `0900 123 456` (any `0900…` / `+251 900…`) | 422: "That number is not registered with TeleBirr" - shown beside the field, focus moves to it |
| `0933 333 333` | 503: "Our kitchen line is busy…" - a message, nothing cleared, press Order again |

Because the client rules run again in `placeOrder`, a forged request that skips the form still gets a 422.
Module 4 will replace this file with a real `fetch("/api/orders")` and a real server.

Tip from the slides: fill the form using only the keyboard, then again with a screen reader on.

## Structure (grouped by feature)

```
src/
  api/        dishes.js, orders.js        ui/       Button, Card, Spinner, ErrorNote, ErrorBoundary
  hooks/      useFetch                    layout/   Header, Nav, Footer
  cart/       cartStore, CartPanel, CartBadge       menu/     Menu, CategoryBar, DishList, DishCard, DishDetail
  checkout/   Checkout, validate, Field   auth/     AuthProvider, useAuth, RequireAuth, Login
  theme/      ThemeProvider, useTheme     pages/    Home, NotFound
```

`ui/` holds only generic pieces: if it mentions a dish or an order, it lives in a feature folder.

## Failure handling (Day 34)

- **Error boundary** (`ui/ErrorBoundary.jsx`, in `Layout`): a render error on one screen shows a message inside `<main>`; header and nav stay usable, and navigating away resets it (`key={pathname}`). Boundaries do not see event handlers or async code, so those keep their own `try/catch` (`useFetch`, `Checkout.handleSubmit`).
- **Lazy route**: `Checkout` is loaded with `lazy()`; `Layout`'s `<Suspense>` shows a spinner while it downloads.
- **Loading / empty / error** on every fetched screen: `Spinner`, "No dishes found in this category", `ErrorNote`.

## Definition of done - checklist

- [ ] Works when a stranger uses it - run the failure checks in `docs/PLAN.md`
- [ ] Loading, empty and error states shown
- [ ] Clean console (`npm run lint` is clean; no warnings in the browser)
- [ ] A history someone can read (one commit per change, e.g. `feat: lazy-load checkout`)
- [ ] Runs from a fresh clone: `git clone ... && npm install && npm run dev`

## Earlier days

- Day 30: `useFetch`, the reducer-based cart (`useReducer` + context, now replaced by the store), `useMemo`, `React.memo`.
- Day 31: routing, layout, params, guards.
