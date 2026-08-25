# Birr Budget

A single-page budget tracker. Log income and expenses in ETB, filter your
transaction history, and see a live running balance. All data is saved to
the browser so your budget is still there when you reload the page.

## What it does

- Add a transaction (description, amount, type, category)
- Categories are loaded from `data/categories.json`
- Live search filters transactions by description or category
- Running totals for income, expenses, and balance update instantly
- Remove any transaction
- Everything is saved to `localStorage`, so a reload does not lose data

## Data used

`data/categories.json` — a local JSON file listing income and expense
categories (Salary, Freelance, Food, Transport, Rent, etc). Loaded with
`fetch()` on page load.

## How to run

Open `index.html` in a browser. No build step, no server, no API key —
it works completely offline.

## Files

| File                  | Purpose                                       |
|------------------------|------------------------------------------------|
| `index.html`           | Page structure — form, transaction list, summary |
| `styles.css`           | Responsive layout and styling                  |
| `app.js`               | State, data loading, rendering, events, storage |
| `data/categories.json` | Income/expense category list                   |

## Self-check

- [x] Layout looks right on mobile and desktop
- [x] Categories load from JSON
- [x] Adding a transaction updates the list and totals immediately
- [x] Search filters live as you type
- [x] Removing a transaction updates totals
- [x] Reloading the page keeps all transactions
- [x] Empty description or amount <= 0 is rejected with a message
- [x] No console errors
