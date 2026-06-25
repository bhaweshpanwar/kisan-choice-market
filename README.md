# Kisan Choice

Direct farmer-to-consumer commerce for Indian agriculture. Kisan Choice removes intermediaries, gives farmers control over pricing through buyer-driven negotiation, and ships a transparent marketplace on the open web.

This repository is the production frontend. The backend lives in a separate repository and is consumed as a REST API.

---

## Live

- Frontend: https://heroic-dragon-0b1a27.netlify.app
- Backend API: https://kisan-choice.onrender.com
- Health check: `curl https://kisan-choice.onrender.com/`

---

## The problem Kisan Choice solves

Indian smallholder farmers consistently lose a large share of their produce revenue to a chain of middlemen, mandis, and platform fees. The buyer pays retail. The farmer receives a fraction. Both sides bear the cost.

Kisan Choice compresses that chain to one. A farmer lists produce. A buyer browses, places a single-use offer against the listed price, and the farmer can accept, reject, or block. Payment is handled by Stripe. Order state, ratings, and dispute signals are kept in a single auditable system. No middlemen. No hidden fees. No waiting for a third party to set the price.

---

## What is in the box

### For consumers

- Browse verified produce by category, with rating, reviews, and seller transparency built into the listing itself.
- Place a single-use offer against any listed product. The offer expires automatically if the farmer does not respond.
- Persistent cart with multi-vendor order splitting.
- Stripe-backed checkout with address book management.
- Order tracking from placement through delivery, with automatic promotion to delivered state after the courier handoff window.
- Profile, password, and address management, with email-based password reset and OTP flows.

### For farmers

- Seller dashboard: inventory, current orders, sales analytics, and a single inbox for incoming offers.
- Per-product control over minimum order quantity, maximum order quantity, stock, and whether the listing is open to negotiation.
- One-click accept, reject, or block on any incoming offer.
- Block abusive buyers permanently. Blocked users cannot see, offer on, or purchase from that farmer.
- Verified-seller badge surfaced to buyers, weighted into search ranking.

### For the platform

- Role-based authentication with three roles: consumer, farmer, admin.
- Admin views for moderation and offer oversight.
- Scheduled jobs (executed via external cron pinger against secret-protected admin endpoints) to expire stale offers and promote shipped orders to delivered.
- Spam protection through per-farmer block lists.
- Structured logging, rate limiting, and HTTP hardening via Helmet, HPP, and CORS allowlist with credentials.

---

## Tech stack

| Layer            | Choice                                       |
|------------------|----------------------------------------------|
| Build            | Vite 5                                       |
| Framework        | React 18, TypeScript                         |
| Styling          | Tailwind CSS, shadcn/ui, Radix primitives    |
| State            | React Context (Auth, Cart), TanStack Query   |
| Routing          | React Router 6                               |
| HTTP             | Axios with cookie-based session auth         |
| Forms            | React Hook Form + Zod                        |
| Payments         | Stripe Checkout (hosted)                     |
| Hosting          | Netlify, continuous deploy from `master`     |
| Backend          | Node.js, Express, PostgreSQL (Neon), JWT     |
| Backend hosting  | Render free tier, Docker                     |

---

## Project layout

```
src/
├── components/
│   ├── auth/        Route guards and session-aware wrappers
│   ├── dashboard/   Farmer-only views (inventory, orders, analytics, blocked users)
│   ├── layout/      App shell, header, sidebar
│   └── ui/          shadcn primitives
├── context/         AuthContext, CartContext
├── hooks/           Shared hooks
├── lib/             Utilities
├── pages/           Route-level screens
├── services/        Typed API clients (api, auth, cart, product, order, negotiation, address)
├── types/           Shared TypeScript types
├── App.tsx          Router and providers
└── main.tsx         Entry
```

The frontend is a single-page application. React Router handles client-side navigation; deep links resolve to the same SPA shell thanks to the Netlify SPA fallback rule in `public/_redirects` and `netlify.toml`.

---

## Environment variables

Create `.env` in the project root:

```
VITE_API_URL=https://kisan-choice.onrender.com
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

For local development against a local backend:

```
VITE_API_URL=http://localhost:3000
```

`VITE_API_URL` is consumed in `src/services/api.ts` as the Axios base URL. The Axios client runs with `withCredentials: true` so the httpOnly JWT cookie issued by the backend is attached to every cross-origin request in production (the backend sets `SameSite=None; Secure` on the cookie for the Netlify-to-Render cross-origin boundary).

---

## Local development

```bash
git clone https://github.com/bhaweshpanwar/kisan-choice-market.git
cd kisan-choice-market
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` by default. The frontend will proxy API calls to whatever `VITE_API_URL` points to.

To build a production bundle:

```bash
npm run build
npm run preview
```

---

## Deployment

Netlify is wired to the `master` branch. Every push to `master` triggers a production build and publish. Required Netlify environment variables:

- `VITE_API_URL` — backend base URL
- `VITE_STRIPE_PUBLIC_KEY` — Stripe publishable key

The build command is `npm run build` and the publish directory is `dist`. Both are encoded in `netlify.toml` at the repository root. The `_redirects` file in `public/` adds an explicit SPA fallback so deep links like `/products/category/grains` resolve to the SPA shell instead of returning a Netlify 404.

---

## API surface (consumed by this frontend)

| Method | Path                                          | Purpose                                 |
|--------|-----------------------------------------------|-----------------------------------------|
| POST   | `/api/v1/users/signup`                        | Register a new consumer                 |
| POST   | `/api/v1/users/login`                         | Issue JWT, set httpOnly cookie          |
| GET    | `/api/v1/users/logout`                        | Clear session                           |
| GET    | `/api/v1/users/me`                            | Current user from cookie                |
| PATCH  | `/api/v1/users/updatePassword`                | Change password                         |
| PATCH  | `/api/v1/users/become-farmer`                 | Upgrade role to farmer                  |
| GET    | `/api/v1/products/category/:category`         | Public list by category                 |
| GET    | `/api/v1/products/:id`                        | Product detail with reviews             |
| GET    | `/api/v1/products/search?q=`                  | Full-text search                        |
| GET    | `/api/v1/categories`                          | All categories                          |
| POST   | `/api/v1/cart`                                | Add to cart                             |
| GET    | `/api/v1/cart`                                | Current cart                            |
| POST   | `/api/v1/cart/checkout`                       | Create pending order                    |
| POST   | `/api/v1/cart/checkout-session`               | Create Stripe Checkout session          |
| POST   | `/api/v1/negotiations`                        | Place a single-use offer                |
| GET    | `/api/v1/orders`                              | Consumer order history                  |
| GET    | `/api/v1/orders/farmer/my-sales`              | Farmer order history                    |

The complete backend contract, schema, and security posture are documented in the backend repository's `README.md`.

---

## Why this matters

Indian agriculture supports nearly half the national workforce, yet the people doing the work capture a shrinking share of the value they create. Kisan Choice is an attempt to put the price-setting power back where it belongs: in the hands of the person who grew the food, and the person who is going to eat it.

Every feature in this codebase exists to serve that goal. The negotiation system is not a gimmick. The block list is not a nicety. The verification badge is not vanity. Each one is a structural answer to a real, recurring failure in agricultural commerce.

This is infrastructure for the next decade of Indian farming.

---

## License

ISC. See `LICENSE` if present in the repository root.
