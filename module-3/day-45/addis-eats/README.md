# Addis Eats

A food ordering app built with Next.js (App Router, JavaScript, `src/` directory, Tailwind CSS).

**Deployed URL:** `PUT-YOUR-DEPLOYED-URL-HERE` (replace after you deploy; the verification steps are in the
"Deploy" section below)

## Run it from a fresh clone

```
git clone <your-repo-url>
cd addis-eats
cp .env.example .env.local      # then edit the values (see below)
npm install
npm run build
npm run start                   # http://localhost:3000
```

For development use `npm run dev`.

### Environment variables

| Variable | Used for | Example |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Absolute URLs in metadata, the sitemap, `robots.txt` and social previews | `https://your-site.example.com` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics id (the script loads lazily; leave unset to disable it) | `G-XXXXXXXXXX` |

`.env.local` is gitignored. `.env.example` is committed and holds dummy values only.

### Demo accounts

| Email | Password | Role |
|---|---|---|
| `hana@example.com` | `hana-pass-123` | customer |
| `dawit@example.com` | `dawit-pass-123` | customer |
| `kitchen@example.com` | `kitchen-pass-123` | staff (can open `/kitchen`) |

## Documents

- [AUTH.md](./AUTH.md): each protected route, its three layers, what each layer proves, and the attacks.
- [DATA.md](./DATA.md): each query: server or client, key, refresh rule and reasoning.
- [PERF.md](./PERF.md): the performance budget, before and after, with causes.
- [STRATEGY.md](./STRATEGY.md): every route, its rendering strategy and why.
- [BOUNDARY.md](./BOUNDARY.md): every component, which side it runs on and why.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm run start` | Production build, then serve it |
| `npm run lint` | ESLint |
| `npm run attacks` | Runs the three attacks against a running production server and prints what stopped each |

## Endpoints

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/api/dishes?q=&page=&limit=` | 200, `{ items, page, limit, total, totalPages }` | |
| GET | `/api/dishes/[id]` | 200, one dish | 404 unknown id |
| POST | `/api/orders` | 201, the new order | 400 invalid JSON, 401 not signed in, 422 validation failed (with `fieldErrors`) |
| GET | `/api/orders/[id]` | 200, the order with its live status | 401 not signed in, 403 not your order, 404 no such order |
| GET | `/api/me` | 200, `{ user }` (null when signed out) | |

Every error uses one shape: `{ "error": { "code", "message" }, ... }`. Unsupported methods return 405.

## Deploy

1. Push to GitHub, then deploy from the repository.
2. Set `NEXT_PUBLIC_SITE_URL` (and `NEXT_PUBLIC_GA_ID` if you want analytics) in the host's environment
   settings. They are read at build time, so redeploy after changing them.
3. **Verify from the page source, not the code:** open the deployed URL, View Source, and check the title,
   `canonical`, `og:image` (an absolute URL on your domain) and the JSON-LD on a dish page; then open
   `/sitemap.xml` and `/robots.txt`.
4. **Important:** sessions, users and orders are stored in server memory (see the known gaps in `AUTH.md`).
   Deploy as **one long-running Node process** (a web service running `npm run build` then `npm run start`).
   On serverless platforms with several instances you will be signed out at random and orders will disappear.

## Folder tree

```
src/
├── proxy.js                     cookie check for /checkout and /orders
├── app/
│   ├── layout.js  providers.js  AuthNav.js  GoogleAnalytics.js  actions.js  globals.css
│   ├── page.js  robots.js  sitemap.js  opengraph-image.jsx
│   ├── signin/      page.js  SignInForm.js
│   ├── checkout/    page.js  OrderForm.js
│   ├── cart/        page.js
│   ├── kitchen/     page.js                      staff only
│   ├── orders/      page.js  CancelButton.js     [id]/ page.js  OrderStatus.js
│   ├── menu/        layout.js  page.js  loading.js  error.js  data.js
│   │                DishList.js  DishCard.js  CategoryBar.js  FilterShell.js  SearchBox.js
│   │                [id]/ page.js  not-found.js  opengraph-image.jsx
│   └── api/         dishes/  dishes/[id]/  orders/  orders/[id]/  me/
└── lib/             schema.js  http.js  db.js  users.js  session.js  safe-next.js  site.js  orders.js  fetcher.js  search.js
```
