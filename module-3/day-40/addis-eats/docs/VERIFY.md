# The six failure checks (run them on the PRODUCTION build)

```bash
npm run build
ENABLE_TEST_ROUTES=1 npm run start     # Windows PowerShell: $env:ENABLE_TEST_ROUTES=1; npm run start
```

`ENABLE_TEST_ROUTES=1` switches on two hooks in `app/menu/dishes.js` (`/menu/slow`, `/menu/boom`).
Without it they do nothing. Ids that were not prebuilt are rendered on request, which is why
they work in production. `/menu` itself is prerendered, so it has nothing to wait for or throw
at runtime. That is the point of ISR, and why these checks use the on-demand dish route.

| # | Do this | Expect | Automated? |
|---|---------|--------|------------|
| 1 | DevTools → Network → **Slow 3G**; open `/menu/slow` (3 s hook) or navigate to `/orders` | `loading.js` skeleton appears; header already there | Manual |
| 2 | Open `/menu/boom` | `menu/error.js` renders ("Something went wrong", Try again); header stays. HTTP status is 500 | Manual (status: `curl -i`) |
| 3 | Open `/menu/not-a-dish` | `not-found.js`, not a crash. Status is 200 with `noindex` (see STRATEGY.md) | `npm run verify` |
| 4 | Post an invalid phone: `curl -i -X POST localhost:3000/api/orders -H "Content-Type: application/json" -d '{"name":"Almaz","phone":"0912","dishId":"dish_1"}'` and use the form | 422 with `fieldErrors.phone`; the form shows the message beside the field | `npm run verify` |
| 5 | DevTools → ⌘/Ctrl+Shift+P → "Disable JavaScript", reload `/checkout`, pick a dish, submit | The order is placed and confirmed | `npm run verify` |
| 6 | `grep -r "abebe@example.com" .next/static` (also try `user_addis_101`) | No matches | `npm run verify` |

Notes
- **Check 2, "the cart survives":** typing a URL reloads the page and empties the in-memory
  cart. To prove the cart survives an error, reach `/menu/boom` by client-side navigation
  (temporarily add `<Link href="/menu/boom">` to the header).
- **Check 5:** with no JavaScript there is no client cart, so the form offers a dish picker
  instead; `placeOrder` accepts either.
- **Attack your own action:** in the browser console, a call to `cancelOrder("ord_900")`
  must be refused with "Not yours". The check is inside the action, not in the button.
