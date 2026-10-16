# Migrating your capstone onto Next.js (Day 40, section 4)

Move **one screen at a time** and keep the app building after each step. A migration done in one
commit is very hard to debug when it fails.

| # | Step | Done when |
|---|------|-----------|
| 1 | Scaffold a new Next.js project beside the old one (`npx create-next-app@latest`, App Router) | `npm run dev` shows the starter |
| 2 | Recreate the route map as folders with empty `page.js` files | Every route reachable (even if empty); `npm run build` passes |
| 3 | Move the layout into `app/layout.js`; move providers into a client `providers.jsx` | Header/footer render on every route; layout still has no directive |
| 4 | Move each screen across, **deleting its fetching hook** (`useFetch`/`useEffect`) as you go | The screen is an async server component awaiting its data |
| 5 | Add `loading.js`, `error.js` (client) and `not-found.js` per segment | Each state forced to show once |
| 6 | Write `STRATEGY.md` and `BOUNDARY.md` for **your** routes | `npm run build` agrees with the Marker column |

Copy `scripts/verify.mjs` into your project and adapt the endpoint and secret lists.

Most code is unchanged: components, styles and validation move across untouched. What changes is
where they live and which of them fetch their own data.

## What usually goes wrong

| Symptom | Cause | Fix (day) |
|---------|-------|-----------|
| "needs useState" everywhere | A hook in a component left on the server | Extract the interactive leaf into `"use client"` (38) |
| Bundle barely smaller | `"use client"` at the top of a page | Push the directive down to the leaf (38) |
| Functions cannot be passed | A callback prop crossing the boundary | Move the function into the client component (38) |
| Hydration mismatch | A date or random value rendered in JSX | Move it into an effect (38) |
| Every route marked dynamic | A cookie read in a shared helper | Find the `cookies()`/`headers()` call (37) |
| 404 on a route that exists | A missing or non-default export | `export default` (36) |

## Templates

`STRATEGY.md`

```md
| Route | Marker | Strategy | Why (one sentence) |
|-------|--------|----------|--------------------|
| `/`   | ○      |          |                    |
```

`BOUNDARY.md`

```md
| Component | Runs on | Why |
|-----------|---------|-----|
|           | Server  |     |
```

Aim for four or five client components. If you have more, list what forces each one.
