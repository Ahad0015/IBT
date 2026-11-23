# Addis Eats

A React front end for a food-ordering app in Addis Ababa, built for the **IBT–CodeOps Module 3 React Project Brief**.
It covers the five required customer routes, all 15 core features, all 11 additional features, and the optional admin extension (17 features).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm test           # unit tests for the pure logic (Node's built-in test runner)
```

Requires Node 20 or newer.

**Demo logins**

| Area | Details |
| --- | --- |
| Customer | No password. Sign in with any name and an Ethiopian mobile number, like `0911 223 344`. |
| Admin | `/admin/login` with username `admin` and password `addis2026`. |

## Routes

| Screen | Route | Notes |
| --- | --- | --- |
| Home | `/` | Today's specials, category tiles, link into the menu |
| Menu | `/menu` | Fetched dishes. Category, search and sort live in the URL (`?category=Pizza&q=lentil&sort=price-asc`) |
| Dish | `/menu/:id` | Ingredients, description, quantity, add to cart, favorite |
| Cart | `/cart` | Lines, +/- controls, remove, live ETB total |
| Checkout | `/checkout` | Validated form. **Guarded**: signed-out visitors go to `/signin`, then come back |
| Favorites | `/favorites` | Saved dishes |
| Order history | `/orders` | Past orders with one-click Reorder. Guarded |
| Sign in | `/signin` | Needed by the checkout and orders guards. Not one of the five required screens, it is the guard's redirect target |
| Admin login | `/admin/login` | |
| Admin dashboard | `/admin` | Nested layout with sidebar and `<Outlet />` |
| Admin menu | `/admin/menu` | Dish CRUD |
| Admin orders | `/admin/orders` | Order management |

The admin routes are a nested, guarded group (`RequireAdmin`) inside the same app.

## Feature map

### Core (1–15)

| # | Feature | Where |
| --- | --- | --- |
| 1 | Browse menu | `menu/Menu.jsx` fetches through `api/dishes.js` |
| 2 | Live search | `Menu.jsx` filters on every keystroke; the URL catches up through `useDebounce` |
| 3 | Category filter | `menu/CategoryBar.jsx`, state in the URL |
| 4 | Add to cart | `menu/AddToCartControl.jsx`, `cart/cartStore.js` |
| 5 | Update quantity | `ui/Stepper.jsx` in cards, dish page and cart |
| 6 | Remove from cart | `cart/CartItem.jsx` (and the − button at quantity 1) |
| 7 | Live ETB total | `selectSubtotal` in `cartStore.js`, rendered by `Cart.jsx` and `Checkout.jsx` |
| 8 | Cart persistence | zustand `persist` to localStorage |
| 9 | Checkout form | `checkout/Checkout.jsx` |
| 10 | Form validation | `checkout/validate.js`, `utils/validators.js`; errors on blur and on submit, focus jumps to the first bad field |
| 11 | Order confirmation | `checkout/OrderConfirmation.jsx` |
| 12 | Loading states | `useFetch`, skeleton grid, spinners, disabled submit while placing |
| 13 | Empty states | `ui/EmptyState.jsx`: empty cart, menu, search, favorites, orders |
| 14 | Error handling | `ui/ErrorState.jsx` with Retry. Add `?simulateError=1` to any URL to see it |
| 15 | Responsive design | Mobile-first CSS, bottom tab bar on phones, top nav from 900px |

### Additional (16–26)

| # | Feature | Where |
| --- | --- | --- |
| 16 | Order history | `orders/OrderHistory.jsx`, `orderHistoryStore.js` |
| 17 | Favorites | `favorites/`, heart on every `DishCard` |
| 18 | Dish detail | `menu/Dish.jsx` |
| 19 | Reorder | `OrderHistoryItem.jsx`: re-reads the menu, so prices are current and removed dishes are skipped and reported |
| 20 | Delivery fee | `utils/deliveryEstimate.js`: by area, free from ETB 800 |
| 21 | Estimated delivery time | Same file: kitchen time of the slowest dish plus travel time |
| 22 | Dark / light theme | `theme/`; saved, follows the system on first visit, no flash on load |
| 23 | Special instructions | Checkout textarea with a 200-character counter |
| 24 | Cart badge | `cart/CartBadge.jsx`, derived from the store |
| 25 | Keyboard accessibility | See below |
| 26 | ETB formatting | `utils/formatCurrency.js` is the only place prices are formatted |

### Admin (1–17)

| # | Feature | Where |
| --- | --- | --- |
| 1 | Admin login | `admin/AdminLogin.jsx` |
| 2 | Session management | `AdminAuthContext.jsx` + `useAdminAuth.js`, stored in `sessionStorage` |
| 3 | Dashboard analytics | `Dashboard.jsx`: revenue, order count, average order, 7-day revenue |
| 4 | Top selling dishes | `Dashboard.jsx` |
| 5 | Status distribution | `Dashboard.jsx`: stacked bar plus labelled legend (not colour alone) |
| 6, 10 | View and search dishes | `DishManager.jsx` |
| 7, 8 | Add and edit dish | `DishForm.jsx` in a modal, with validation |
| 9 | Delete dish | Confirmation modal |
| 11 | View all orders | `OrderManager.jsx`, with status filter and search |
| 12 | Update status | Inline select, or "Mark as next step" in the details dialog |
| 13 | Delete order | Confirmation modal |
| 14 | Order details | Dialog with customer, items, totals, status tracker |
| 15 | Data persistence | Dishes and orders in localStorage |
| 16 | Data seeding | Dishes load from `public/menu-data.json` on first run; demo orders seed once when the admin area first opens |
| 17 | Logout | `AdminLayout.jsx`, ends the session and returns to `/admin/login` |

Customer orders and admin orders are the same list, so an order placed at checkout appears in the admin immediately. Admin menu edits show on the customer menu immediately.

## Where state lives

| State | Where | Why |
| --- | --- | --- |
| Selected category, search, sort | URL (`useSearchParams`) | Shareable, survives refresh |
| Fetched dishes | `Menu` (and `Dish`, `Home`, `Favorites`) via `useFetch` | Only the component that shows them needs them |
| Cart | `cart/cartStore.js` (zustand + persist) | Read by Menu, Dish, Cart, Checkout, header badge |
| Customer session | `auth/AuthProvider` (context) | Rarely changes, needed by the route guard |
| Admin session | `admin/AdminAuthContext` (context + sessionStorage) | Same, scoped to `/admin` |
| Checkout fields and note | `Checkout` component state | Nobody else needs them |
| Modal open/closed | The component that opens it | |
| Favorites | `favorites/favoritesStore.js` (persisted) | Read by every heart and by Favorites |
| Orders | `orders/orderHistoryStore.js` (persisted) | Appended at checkout, read by history and admin |
| Theme | `theme/ThemeContext` (persisted) | Layout reads it, anything can set it |
| Delivery fee, ETA, cart badge, totals | **Derived on render**, never stored | |

## Folder structure

Grouped by feature, so each folder can be understood (and deleted) on its own.

```
addis-eats/
├─ public/menu-data.json      seed data standing in for an API
└─ src/
   ├─ api/        dishes.js, orders.js, storage.js
   ├─ hooks/      useFetch, useDebounce, useDocumentTitle
   ├─ ui/         generic only: Button, Modal, Spinner, Stepper, Toast, EmptyState, ErrorState, Icon
   ├─ utils/      formatCurrency, deliveryEstimate, validators
   ├─ home/ menu/ cart/ checkout/ favorites/ orders/ theme/ auth/
   ├─ admin/      AdminLogin, AdminLayout, Dashboard, DishManager, DishForm, OrderManager, ...
   ├─ App.jsx  Layout.jsx  main.jsx
```

## Accessibility (feature 25)

- Skip link, plus focus moves to the page content after each route change.
- Every control is a real `<button>` or `<a>`; the keyboard focus ring is always visible.
- Modals trap focus, close on Escape, and return focus to what opened them.
- Form fields have labels, `aria-invalid`, and `aria-describedby` for hints and errors; on a failed submit focus goes to the first invalid field.
- Cart changes, search result counts and toasts are announced through live regions.
- Status is never shown by colour alone, and `prefers-reduced-motion` is respected.

## Notes and trade-offs

- There is no backend. `api/dishes.js` plays the part of one, with a short artificial delay so loading states are visible.
- The customer sign-in has no password. It is a demo gate that records a name and phone number.
- Dish pictures are emoji on category-coloured tiles, which keeps the repo free of image files. `menu/` is the only place to change if you want real photos.
- Single-page app hosting needs a fallback to `index.html` for unknown paths (Netlify `_redirects`: `/* /index.html 200`, Vercel does it automatically for Vite).
