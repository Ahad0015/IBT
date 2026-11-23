This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev# Addis Eats

A food ordering app built with Next.js (App Router, JavaScript, `src/` directory,
Tailwind CSS).

## Run

```
npm install
npm run build
npm run start
```

Open http://localhost:3000. For development use `npm run dev`.

## Documents

- [STRATEGY.md](./STRATEGY.md): every route, its rendering strategy and why.
- [BOUNDARY.md](./BOUNDARY.md): every component, which side it runs on and why.

## Folder tree

```
src/
├── app/
│   ├── layout.js            root shell (server)
│   ├── providers.js         cart provider (client)
│   ├── actions.js           placeOrder, cancelOrder (server actions)
│   ├── globals.css
│   ├── page.js              /
│   ├── cart/page.js         /cart
│   ├── checkout/
│   │   ├── page.js          /checkout
│   │   └── OrderForm.js     (client)
│   ├── orders/
│   │   ├── page.js          /orders
│   │   └── CancelButton.js  (client)
│   ├── menu/
│   │   ├── layout.js        sidebar
│   │   ├── page.js          /menu
│   │   ├── loading.js
│   │   ├── error.js         (client)
│   │   ├── data.js
│   │   ├── DishList.js
│   │   ├── CategoryBar.js   (client)
│   │   ├── FilterShell.js   (client)
│   │   └── [id]/
│   │       ├── page.js      /menu/1 ...
│   │       └── not-found.js
│   └── api/
│       ├── dishes/route.js         GET /api/dishes
│       ├── dishes/[id]/route.js    GET /api/dishes/:id
│       └── orders/route.js         POST /api/orders
└── lib/
    ├── schema.js            the one zod schema (form and server)
    ├── http.js              standard error shape
    ├── db.js                in-memory orders
    └── session.js           session cookie helpers
```

## Endpoints

| Method | Path | Success | Errors |
|---|---|---|---|
| GET | `/api/dishes` | 200, list of dishes | |
| GET | `/api/dishes/[id]` | 200, one dish | 404 unknown id |
| POST | `/api/orders` | 201, the new order | 400 invalid JSON, 422 validation failed (with `fieldErrors`) |

Unsupported methods (for example GET on `/api/orders`) return 405.

Standard error shape:

```json
{ "error": { "code": "NOT_FOUND", "message": "No dish with id \"999\"" } }
```

Validation errors add a `fieldErrors` object next to `error`:

```json
{
  "error": { "code": "VALIDATION_FAILED", "message": "Please fix the errors" },
  "fieldErrors": { "name": ["Name must be at least 2 characters"] }
}
```

## Server actions

- `placeOrder`: validates the form with the shared zod schema, writes the order, calls `revalidatePath("/orders")`. Used with `useActionState` for the pending flag and field errors.
- `cancelOrder`: checks the session, then that the order belongs to that user, before writing. Authorisation is always checked on the server.

## Build output

```
Route (app)      Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ƒ /api/dishes
├ ƒ /api/dishes/[id]
├ ƒ /api/orders
├ ○ /cart
├ ƒ /checkout
├ ○ /menu                1m      1y
├   /menu/[id]
│ ├ ● /menu/1
│ ├ ● /menu/2
│ ├ ● /menu/3
│ └ ● /menu/4
└ ƒ /orders

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```
Route (app)
...
```

## Verification

Curl results on `npm run start`:

| Request | Expected | Got |
|---|---|---|
| GET `/api/dishes` | 200 | 200 |
| GET `/api/dishes/1` | 200 | 200 |
| GET `/api/dishes/999` | 404 | 404 |
| POST `/api/orders` with `{}` | 422 | 422 |
| POST `/api/orders` valid | 201 | 201 |
| POST `/api/orders` with `not json` | 400 | 400 |
| GET `/api/orders` | 405 | 405 |

Failure checks on the production build:

| # | Check | Result |
|---|---|---|
| 1 | Unknown URL `/nope` shows a 404 page | Pass: 404 page shown |
| 2 | `/menu/999` shows the dish not-found page | Pass: dish not-found page shown |
| 3 | Bad input to the API returns 422 / 400 | Pass: `{}` gave 422 with `fieldErrors`, `not json` gave 400 |
| 4 | Wrong method returns 405 | Pass: GET on `/api/orders` gave 405 |
| 5 | JavaScript disabled: pages and links work; checkout form behaviour | Pass: menu, dish pages and links work because they are server-rendered; category buttons and the vegetarian toggle stop responding; the checkout form still reaches the server action |
| 6 | Cancel attacks from the console rejected | Pass: no cookie gave "You must be signed in", a fake id gave "Order not found", another user's order gave "You can only cancel your own orders" |

## What I learned from the build vs the strategy table

Every route matched its row in STRATEGY.md. The one thing I had to check
rather than assume was the `/api` GET handlers: they show as dynamic because
route handlers are not cached by default.
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
