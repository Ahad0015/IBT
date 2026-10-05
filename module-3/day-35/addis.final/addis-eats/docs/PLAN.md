# Addis Eats - plan (Day 35)

The planning artefacts the brief asks for: component tree with ownership, the
state-placement table, folders by feature, and the build order.

## Component tree (what each piece owns / receives)

```
App                       providers: Auth, Theme, Router
└─ Layout                 header, nav, ErrorBoundary > Suspense > Outlet, footer
   ├─ Home                owns: nothing (fetches specials)           reads: cart.addItem
   ├─ Menu                owns: category (URL), dishes (fetched)
   │  ├─ CategoryBar      props: categories, selected, onSelect
   │  └─ DishList         props: dishes, onAdd
   │     └─ DishCard      props: name, price, image, spicy, to, onAdd
   ├─ DishDetail          owns: dishes (fetched)   reads: :id, cart.addItem
   ├─ CartPanel           reads: cart store (items, total, remove, clear)
   ├─ Checkout  (lazy)    owns: form, touched, submitting, serverErrors   reads: cart, user
   ├─ Login               owns: phone, error        reads: auth.login
   └─ NotFound            props: message
Header > CartBadge        reads: cart count only
Nav                       reads: auth (user, logout), theme
```

## State placement

| State | Where it belongs | Why |
| --- | --- | --- |
| Selected category | The URL (`?category=`) | Shareable, survives refresh |
| Fetched dishes | The component that displays them (`useFetch`) | Server data; nobody else needs it |
| The order | Zustand store (`cart/cartStore.js`) | Read on four screens, changes on every click |
| Sign-in session | Context (`auth/AuthProvider`) | Rarely changes, needed by the guard |
| Theme | Context (`theme/ThemeProvider`) | Rarely changes; kept apart so it never re-renders with the cart |
| Checkout form fields | `Checkout` and nowhere else | Nothing else reads them |
| Which page crashed | `ErrorBoundary` state, reset by `key={pathname}` | Local to the boundary |

## Folders (by feature)

```
src/
  api/        dishes.js (URL), orders.js (pretend endpoint)
  hooks/      useFetch                    reusable only
  ui/         Button, Card, Spinner, ErrorNote, ErrorBoundary    no business logic
  layout/     Header, Nav, Footer
  cart/       cartStore, CartPanel, CartBadge
  menu/       Menu, CategoryBar, DishList, DishCard, DishDetail
  checkout/   Checkout, validate.js, Field
  auth/       AuthProvider, useAuth, RequireAuth, Login
  theme/      ThemeProvider, useTheme
  pages/      Home, NotFound
  App.jsx  Layout.jsx
```

## Build order (vertical slices)

1. Routes and Layout - every screen reachable, even if empty
2. Menu: fetch, loading, error, list
3. Filter and dish detail route
4. Cart store, adding from the menu
5. Checkout form with validation
6. Guard, boundary, lazy route, polish

## Brief requirements -> where they live

| Day | Requirement | Where |
| --- | --- | --- |
| 26-27 | Composed components, props, keys, conditional rendering | `menu/DishList` -> `DishCard`, `Menu` empty/loading/error branches |
| 28 | State and events; a controlled form | `checkout/Checkout.jsx` |
| 29 | Data fetched in an effect, with cleanup | `hooks/useFetch.js` (AbortController) |
| 30 | A custom hook, and context or a store | `useFetch`; `AuthProvider`, `ThemeProvider`, `cartStore` |
| 31 | Nested routes, dynamic route, guarded route | `App.jsx`: `Layout` + `menu/:id` + `RequireAuth` |
| 33 | Validation | `checkout/validate.js`, `api/orders.js` re-validates |
| 34 | Error boundary, one lazy route | `ui/ErrorBoundary.jsx` in `Layout`; `Checkout` via `lazy()` |

## Failure checks (run before presenting)

| Do this | Expect |
| --- | --- |
| Throttle to Slow 3G | Spinner, never a blank screen |
| Rename `public/api/dishes.json` | "Could not load the menu: Request failed (404)" |
| Filter to an empty category (`/menu?category=Nope`) | "No dishes found in this category." |
| Type a nonsense URL | NotFound screen |
| Open `/checkout` signed out | Redirect to `/login`, return to `/checkout` after sign-in |
| Reload on every screen | Each loads cold without crashing |
| Keyboard only through checkout; greyscale pass | Completes; errors visible without colour |
