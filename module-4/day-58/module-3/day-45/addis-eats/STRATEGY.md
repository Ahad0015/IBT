# Rendering strategy: Addis Eats

Every route, its rendering strategy, and one line saying why. Markers are from `npm run build`:
`○` static, `●` prerendered from params, `ƒ` dynamic.

| Route | Marker | Strategy | Why |
|---|---|---|---|
| `/` | ○ | Static | Same content for every visitor, built once. |
| `/menu` | ○ | Static + `revalidate = 60` | The menu changes rarely; a minute of staleness is fine and speed matters. |
| `/menu/[id]` | ● | Static (`generateStaticParams`) | Dish ids are known at build time, so every dish page is prebuilt. |
| `/cart` | ○ | Static | No per-user server data yet, so the page is the same for everyone. |
| `/signin` | ƒ | Dynamic | Reads the session and the `?next=` parameter. |
| `/checkout` | ƒ | Dynamic (`force-dynamic`) | Depends on who is asking: it reads the session cookie. |
| `/orders` | ƒ | Dynamic (`force-dynamic`) | Shows the current user's orders only. |
| `/orders/[id]` | ƒ | Dynamic (`force-dynamic`) | Private to its owner; the page renders the order, then the client polls its status. |
| `/kitchen` | ƒ | Dynamic (`force-dynamic`) | Staff only; depends on the session role. |
| `/api/dishes` | ƒ | Route handler | Reads `request.url` (`q`, `page`, `limit`); not cached. |
| `/api/dishes/[id]` | ƒ | Route handler | Looks a dish up per request; 404 for an unknown id. |
| `/api/orders` | ƒ | Route handler (POST) | Validates the body and writes an order; needs a session. |
| `/api/orders/[id]` | ƒ | Route handler | Depends on who is asking (session plus ownership check). |
| `/api/me` | ƒ | Route handler | Answers "who is signed in?" for the header. |
| `/sitemap.xml` | ○ | Generated file route | Built from the dish records at build time; private routes left out. |
| `/robots.txt` | ○ | Generated file route | Fixed rules; lists the sitemap. |
| `/opengraph-image` | ○ | Generated image | The site-wide preview never changes between builds. |
| `/menu/[id]/opengraph-image` | ƒ | Generated image per request | One preview per dish, built from the dish record. (Adding `generateStaticParams` here would prebuild them.) |

`src/proxy.js` runs before `/checkout/*` and `/orders/*` (the Proxy line in the build output): a cheap cookie
check with a visible redirect. It is not the security; see `AUTH.md`.

Server actions (`signIn`, `signOut`, `placeOrder`, `cancelOrder`) are not routes. They run on request, and the
two order actions call `revalidatePath("/orders")` after a successful write.

## Layouts

- `src/app/layout.js`: root layout. Owns `<html>` and `<body>`, the font, the header (with `AuthNav`), the footer,
  `globals.css`, the `Providers` wrapper and the analytics script.
- `src/app/menu/layout.js`: nested layout with the category list. It persists when moving from `/menu` to a dish.

## Streaming

`menu/loading.js` is the loading boundary for the menu segment, so the sidebar renders first and the page
streams in after.

## Build vs strategy

Compared against the `npm run build` route table: every row above matches its marker.
