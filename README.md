# RackTrack — Warehouse Management System

A working inventory and order management web app built to replace paper
records and spreadsheets in warehouse operations.

## Problems this solves

| Manual-process problem | RackTrack feature |
|---|---|
| Inaccurate inventory records | Single persisted product database; quantities update automatically on every order |
| Time spent searching for products | Instant search by name, SKU, or aisle-rack-shelf location, plus category/status filters |
| Products going out of stock unnoticed | Reorder-point tracking flags LOW / OUT items automatically |
| Overstocking wastes space and money | Max-level tracking flags OVERSTOCK items with reduction suggestions |
| Slow, error-prone order processing | Guided order builder validates stock availability and deducts inventory automatically |
| No real-time visibility for managers | Live dashboard with KPIs, category chart, and a real-time clock/status indicator |

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  main.jsx              entry point
  App.jsx                app shell: navigation, state, storage wiring
  App.css                all styling
  index.css              base reset
  components/
    Dashboard.jsx         KPI strip, category chart, "needs attention" list
    InventoryView.jsx      searchable/filterable product table with CRUD
    OrdersView.jsx          order history table
    AlertsView.jsx           reorder & overstock alert panels
    ProductModal.jsx         add/edit product form
    OrderModal.jsx            order builder with stock validation
    RackGauge.jsx               stock-level gauge + status badge
  utils/
    helpers.js             shared constants, status logic, formatting
    storage.js              localStorage persistence helpers
  data/
    seedData.js              10 sample products across 4 categories
```

## Data & persistence

Inventory and order data are stored in the browser's `localStorage` under
the `racktrack:` key prefix, so your data survives page refreshes and
restarts of the dev server. To reset to the sample data, clear your
browser's local storage for this site (or open dev tools → Application →
Local Storage → delete the `racktrack:products` and `racktrack:orders`
keys).

## Tech stack

- React 18 + Vite
- [lucide-react](https://lucide.dev/) for icons
- [recharts](https://recharts.org/) for the category chart
- Plain CSS (no framework) — see `src/App.css`
