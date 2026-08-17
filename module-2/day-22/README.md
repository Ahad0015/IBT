# Birr Watch

Birr Watch is a JavaScript web application that tracks live Ethiopian Birr (ETB) exchange rates.

## Features

- Live ETB exchange rates
- Convert ETB to other currencies
- Currency selection
- Add currencies to a watchlist
- Remove currencies from the watchlist
- Save the watchlist using localStorage
- Restore saved data after refreshing the page
- Loading state
- Error handling
- Input validation

## Technologies

- HTML
- CSS
- JavaScript
- Fetch API
- Async/Await
- DOM
- localStorage
- JSON

## API

This project uses the ExchangeRate API:

https://open.er-api.com/v6/latest/ETB

The base currency is ETB.

## Project Structure

```text
birr-watch/
│
├── index.html
├── styles.css
├── app.js
└── README.md
```

## How to Run

1. Download or clone the project.
2. Open the `birr-watch` folder.
3. Open `index.html` in a web browser.
4. Make sure you have an internet connection because the application loads live exchange-rate data from the API.

## How It Works

The application uses one state object as the source of truth.

The main flow is:

State → Render → User Event → Update State → Render

Exchange rates are loaded from the API using `fetch()` and `async/await`.

The selected amount is converted using the exchange rate returned by the API.

The watchlist is saved in `localStorage`, so it remains available after refreshing the browser.

## Validation

The application rejects:

- Empty amounts
- Zero
- Negative amounts
- Invalid numbers

## Watchlist

Users can:

1. Select a currency.
2. Click **Add Currency**.
3. See the currency in the watchlist.
4. Remove a currency using the **×** button.
5. Refresh the page and keep the saved watchlist.

## Error Handling

If the API cannot be reached, the application displays:

```text
Could not load rates.
```

If an invalid amount is entered, the application displays:

```text
Enter a valid amount.
```

## Author

Birr Watch JavaScript Project
