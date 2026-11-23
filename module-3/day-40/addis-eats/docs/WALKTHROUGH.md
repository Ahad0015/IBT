# 8-minute walkthrough (present from `npm run start`)

| Minutes | Cover | Do |
|---------|-------|----|
| 0–1 | What it does, which routes exist | Show the route table in the README |
| 1–3 | Live walkthrough on the production build | Menu → filter → add to cart → cart → checkout → order → /orders → cancel |
| 3–5 | Strategy table, one route you changed your mind about | `STRATEGY.md` beside the build output; `npm run verify` section 2 |
| 5–7 | Boundary map, bundle before and after | `BOUNDARY.md`; `grep -rl "use client" app components`; `npm run size` vs your Day 35 number |
| 7–8 | One endpoint with curl, then questions | The 422 curl from the README |

Have ready: your Day 35 First Load JS, a sentence for each client component, and the answer to
"which part of the app calls /api/dishes?" (nothing: it is for outside callers).
