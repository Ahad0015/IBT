# Server / Client Boundary

| Component                    | Runs on | Why                                                        |
|------------------------------|---------|------------------------------------------------------------|
| app/layout.js                | Server  | Passes children into Providers, imports nothing client     |
| app/providers.jsx            | Client  | Context holds state                                        |
| components/Header.js         | Server  | Static links and markup                                    |
| components/CartCount.jsx     | Client  | Reads cart context to show the item count                  |
| components/Footer.js         | Server  | Static markup                                              |
| app/menu/layout.js           | Server  | Static sidebar text, no interactivity                      |
| app/menu/page.js             | Server  | Awaits dishes; no interactivity of its own                 |
| app/menu/FilterShell.jsx     | Client  | Holds the selected category and handles clicks             |
| app/menu/DishList.jsx        | Server  | Pure markup from data; ships no JavaScript                 |
| app/menu/AddToCartButton.jsx | Client  | onClick, and writes to the cart store                      |
| app/menu/[id]/page.js        | Server  | Fetches dish and reviews in parallel                       |
| app/cart/page.js             | Server  | Heading and layout only                                    |
| app/cart/CartView.jsx        | Client  | Reads and edits the cart                                   |
| app/checkout/page.js         | Server  | Reads cookies(); must run on the server                    |
| app/menu/error.js            | Client  | Needs an event handler for retry (framework requires it)   |
| app/menu/loading.js          | Server  | Static skeleton                                            |
| app/not-found.js             | Server  | Static markup                                              |

## Bundle comparison (/menu)

|        | First Load JS | Notes                          |
|--------|---------------|--------------------------------|
| Before | ___ kB        | Day 37 build                   |
| After  | ___ kB        | Day 38 build                   |

**Why the difference:** (write 2–3 sentences: what moved off the client, what stayed.)