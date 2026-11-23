# Rendering strategy: Addis Eats

Every route, its rendering strategy, and one line saying why.

| Route | Strategy | Why |
|---|---|---|
| `/` | Static | Same content for every visitor, so it is built once at build time. |
| `/menu` | Static + revalidate (60s) | The menu changes rarely, so a minute of staleness is fine and the page is rebuilt in the background. |
| `/menu/[id]` | Static (generateStaticParams) | Dish ids are known at build time, so every dish page is prebuilt. |
| `/cart` | Static | No per-user server data yet, so the page is the same for everyone. |
| `/checkout` | Dynamic (force-dynamic) | Reads the visitor's cookies with `cookies()`, which only exist at request time. |
| `/orders` | Dynamic | Shows the current user's orders, read from the session cookie on every request. |
| `/api/dishes` | Dynamic (route handler) | GET handlers run on request and are not cached by default. |
| `/api/dishes/[id]` | Dynamic (route handler) | Looks a dish up per request; returns 404 for an unknown id. |
| `/api/orders` | Dynamic (route handler) | POST: validates the body, writes the order and sets the session cookie. |

Server actions (`placeOrder`, `cancelOrder`) are not routes. They run on request
and call `revalidatePath("/orders")` after a successful write.

## Layouts

- `src/app/layout.js`: root layout. Owns `<html>` and `<body>`, the header, the footer, `globals.css` and the `Providers` wrapper.
- `src/app/menu/layout.js`: nested layout with the category sidebar. It persists when navigating from `/menu` to a dish.

## Streaming

`menu/loading.js` is the loading boundary for the menu segment, so the sidebar
renders first and the page content streams in after.

## Build vs strategy

I compared the `npm run build` route table against the table above. Every route
matched: `/`, `/cart` and `/menu` are static (`○`), `/menu` has a 1m revalidate,
`/menu/[id]` is prebuilt with generateStaticParams (`●`), and `/checkout`,
`/orders` and the three `/api` routes are dynamic (`ƒ`).

What I learned: the `/api` GET handlers are dynamic by default because Next.js
does not cache route handlers, so they needed no extra configuration.