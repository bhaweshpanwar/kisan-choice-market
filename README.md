
# Kisan Choice Frontend

This is the frontend for the Kisan Choice platform — a web application that empowers farmers by enabling direct-to-consumer transactions, negotiation-based pricing, and transparent e-commerce interactions.

Built with Vite, React, TypeScript, and Tailwind CSS, the frontend communicates with a secure Express/PostgreSQL backend hosted on AWS.

## Live Site

https://heroic-dragon-0b1a27.netlify.app

## Backend API

https://apiaws.bhaweshpanwar.xyz

## Tech Stack

- Vite
- React (with Hooks and functional components)
- TypeScript
- Tailwind CSS
- shadcn/ui (for styled components)
- Axios (for HTTP requests)
- Zustand (state management)
- Netlify (hosting)
- GitHub Actions (CI/CD)

## Features

- User authentication (JWT + cookies)
- Role-based dashboards (Farmer, Buyer)
- Product browsing and filtering
- Farmer product management
- Buyer cart and order tracking
- Offer & negotiation interface
- OTP-based verification (via email)
- Stripe payment integration
- Persistent user sessions via cookies
- Fully responsive design

## Project Structure

```

src/
├── assets/               # Static assets (images, logos)
├── components/           # Shared React components
├── context/              # Zustand stores
├── hooks/                # Custom React hooks
├── pages/                # Page-level components (routes)
├── services/             # API clients (Axios, etc.)
├── types/                # TypeScript type definitions
├── utils/                # Reusable utilities
├── App.tsx               # Root component
└── main.tsx              # App bootstrap

```

## Environment Variables

Create a `.env` file in the root directory with the following:

```

VITE\_API\_URL=[https://apiaws.bhaweshpanwar.xyz](https://apiaws.bhaweshpanwar.xyz)

````

> In development, you can use `http://localhost:3000` instead.

## How to Run Locally

```bash
# Clone the repo
git clone https://github.com/bhaweshpanwar/kisan-choice-market.git
cd kisan-choice-market

# Install dependencies
npm install

# Start development server
npm run dev
````

The app will be available at `http://localhost:5173` by default.

## Deployment

This project is deployed via [Netlify](https://netlify.com) with continuous deployment from the GitHub repository.

To deploy:

1. Push changes to `main` branch.
2. Netlify will automatically rebuild and publish.
3. Ensure the correct environment variables (`VITE_API_URL`) are set in Netlify dashboard.

## Custom Domain

The frontend is available at:

[https://heroic-dragon-0b1a27.netlify.app](https://heroic-dragon-0b1a27.netlify.app)
And optionally via:

[https://kisanchoice.bhaweshpanwar.xyz](https://kisanchoice.bhaweshpanwar.xyz)

Set up via Cloudflare and Netlify custom domain settings.

## Author

**Bhawesh Panwar**
Bachelor of Computer Applications
Devi Ahilya Vishwavidyalaya, Indore
GitHub: [@bhaweshpanwar](https://github.com/bhaweshpanwar)

```

