<<<<<<< HEAD
# MichiCrochet — Frontend

Complete React + Vite frontend for the MichiCrochet e-commerce site.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env

# 3. Edit .env — set your backend URL
# VITE_API_URL=http://localhost:5000/api

# 4. Start the dev server
npm run dev
# → Runs on http://localhost:3000
# → API calls are proxied to http://localhost:5000
```

## Features

| Feature | Route | Backend Endpoint |
|---|---|---|
| Home + hero | `/` | — |
| Shop + filter/sort | `/shop` | `GET /api/products` |
| Product card + cart | — | — |
| Cart drawer | — | — |
| Stripe checkout | — | `POST /api/checkout` |
| Sign in / Register | modal | `POST /api/auth/login` / `register` |
| Custom order form | `/custom-order` | `POST /api/custom-orders` |
| Sale alert email | home | `POST /api/sale-alerts` |
| My orders | `/orders` | `GET /api/orders` |
| About page | `/about` | — |

## File Structure

```
src/
  api/index.js          ← all fetch calls, one place
  context/
    AuthContext.jsx     ← user login state
    CartContext.jsx     ← cart state
  components/
    Navbar.jsx
    Footer.jsx
    CartDrawer.jsx
    AuthModal.jsx
    ProductCard.jsx
  pages/
    Home.jsx
    Shop.jsx
    About.jsx
    Orders.jsx
    CustomOrder.jsx
  App.jsx
  main.jsx
  index.css             ← all styles (CSS variables, global classes)
```

## Build for Production

```bash
npm run build
# Output in /dist — deploy to Vercel, Netlify, etc.
```

## Notes

- `vite.config.js` proxies `/api` → `localhost:5000` in dev so you don't need CORS setup locally
- Products fall back to hardcoded demo data if the server isn't running
- Stripe checkout redirects to the URL returned by your `/api/checkout` endpoint
- Auth token is stored in React state (memory only — users re-login on refresh; add localStorage if needed)
=======
# michicrochet-frontend
complete frount of michicrochet
>>>>>>> 8239be9349db7b14d7501106624a0113232332c8
