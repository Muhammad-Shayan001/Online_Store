# OS — Full-Stack E‑commerce Website

This repository contains a full-stack e‑commerce web application (frontend + backend) with admin features, payments, invoicing, and deployment configuration. The codebase uses a React + Vite frontend and a Node.js/Express backend with MongoDB. It includes Docker assets and deployment configs for common hosts.

---

## Table of Contents

- Project overview
- Tech stack & architecture
- Main features
- Project layout (key files & folders)
- Setup & run (development & production)
- Environment variables
- Backend API & routes
- Frontend structure & components
- Admin area
- Utilities, scripts & tests
- Deployment & Docker
- Contributing & support

---

## Project overview

This app is a production-oriented online store with user accounts, product catalog, shopping cart, checkout, order management, coupon support, invoice generation, and an admin dashboard for managing products, orders, users, coupons and support tickets.

It was built to be modular: a React TypeScript frontend communicates with an Express API connected to MongoDB. Email, SMS, and invoice generation utilities are included for transactional workflows.

## Tech stack & architecture

- Frontend: React + TypeScript, Vite
- Backend: Node.js + Express
- Database: MongoDB (connection in [backend/config/db.js](backend/config/db.js))
- Authentication: JWT tokens generated in [backend/utils/generateToken.js](backend/utils/generateToken.js)
- Storage: local uploads endpoint ([backend/routes/uploadRoutes.js](backend/routes/uploadRoutes.js))
- Email/SMS: utilities in [backend/utils/emailService.js](backend/utils/emailService.js) and [backend/utils/smsService.js](backend/utils/smsService.js)
- Invoicing: [backend/utils/invoiceGenerator.js](backend/utils/invoiceGenerator.js)
- Dev tooling: Nodemon in backend, Vite for frontend
- Containerization: `Dockerfile` and [docker-compose.yml](docker-compose.yml)

## Main features

- Product catalog with categories, images and 3D card (see `ProductCard3D.tsx`)
- Product search and listing pages
- Product detail page with quick view modal
- Shopping cart and persisted cart state
- Checkout flow with order creation and invoice generation
- Coupons and discounts management (apply coupons at checkout)
- User authentication: register, login, password reset
- Profile page with order history
- Admin dashboard for managing products, orders, users, coupons and tickets
- File upload endpoints for product images
- Email notifications and logging (order confirmations, password resets)
- Basic analytics hooks and tracking component
- Live chat component for user support

## Project layout (high level)

- Root
  - `App.tsx`, `index.tsx`, `vite.config.ts` — frontend entry
  - `package.json` — root scripts (frontend) and dependencies
  - `Dockerfile`, `docker-compose.yml`, `nginx.conf` — container/deploy assets
  - `docs/API.md` — API documentation
- `backend/` — Express app
  - `server.js` — backend server entry ([backend/server.js](backend/server.js))
  - `config/db.js` — MongoDB connection
  - `controllers/` — controller logic for `product`, `order`, `user`, `ticket`, `coupon`
  - `routes/` — Express routes: `productRoutes.js`, `userRoutes.js`, `orderRoutes.js`, `couponRoutes.js`, `ticketRoutes.js`, `adminRoutes.js`, `uploadRoutes.js`
  - `models/` — Mongoose models (Product, User, Order, Coupon, Ticket, etc.)
  - `utils/` — helper utilities (email, sms, invoice, logger, generateToken)
  - `scripts/` — maintenance and test scripts (user registration, backups, inspections)
- `components/` — reusable React components (Navbar, Footer, ProductCard3D, LiveChat, QuickViewModal, SEO, etc.)
- `pages/` — top-level pages: Home, ProductList, ProductDetail, Cart, Checkout, Profile, Admin pages

## Setup & run

1. Install dependencies for frontend (root) and backend:

```bash
# frontend
npm install

# backend
cd backend
npm install
```

2. Run in development (two terminals):

```bash
# Start frontend (from project root)
npm run dev

# Start backend (from backend/)
npm run dev
```

3. Production with Docker Compose:

```bash
docker-compose up --build
```

Notes: exact script names may vary; check the `package.json` files at the root and in [backend/package.json](backend/package.json).

## Environment variables

Create a `.env` file in `backend/` (and optionally in root for frontend runtime config). Common variables used by the app:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for JWT tokens
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` — SMTP credentials for transactional emails
- `SMS_API_KEY` — SMS provider key (if SMS integration used)
- `NODE_ENV` — `development` or `production`
- `PORT` — backend server port

See [backend/config/db.js](backend/config/db.js) and [backend/utils/emailService.js](backend/utils/emailService.js) for where these are consumed.

## Backend API & routes

The backend exposes REST endpoints organized in `backend/routes/`:

- Products: [backend/routes/productRoutes.js](backend/routes/productRoutes.js)
- Users: [backend/routes/userRoutes.js](backend/routes/userRoutes.js)
- Orders: [backend/routes/orderRoutes.js](backend/routes/orderRoutes.js)
- Coupons: [backend/routes/couponRoutes.js](backend/routes/couponRoutes.js)
- Tickets (support): [backend/routes/ticketRoutes.js](backend/routes/ticketRoutes.js)
- Admin: [backend/routes/adminRoutes.js](backend/routes/adminRoutes.js)
- Uploads: [backend/routes/uploadRoutes.js](backend/routes/uploadRoutes.js)

Each route uses controllers from `backend/controllers/` and middleware in `backend/middleware/` for authentication and authorization (`authMiddleware.js`, `optionalProtect.js`). See [docs/API.md](docs/API.md) for documented endpoints and examples.

## Frontend structure & components

- Entrypoint: [index.tsx](index.tsx) and `App.tsx`
- Layouts: `WebsiteLayout.tsx`, `AdminLayout.tsx`
- Key components:
  - `Navbar.tsx`, `Footer.tsx` — site chrome
  - `ProductCard3D.tsx` — product card with 3D visuals
  - `QuickViewModal.tsx` — quick product preview
  - `CartDrawer.tsx` — persistent cart UI
  - `LiveChat.tsx` — customer chat UI
  - `SEO.tsx` — meta tags and SEO helper

Pages live in `pages/` and `pages/admin/`. The legal pages are under `legal/` and `frontend/src/pages/legal/`.

## Admin area

Admin components and pages are in `pages/admin/` and `components/admin/`. Admin features include:

- Product create/edit/listing: `AdminProductList.tsx`, `AdminProductEdit.tsx`
- Order admin and order detail view: `AdminOrderList.tsx`, `AdminOrderDetails.tsx`
- User management: `AdminUserList.tsx`
- Coupon management: `AdminCouponList.tsx`

Admin routes are secured server-side by admin-only middleware. See [backend/middleware/authMiddleware.js](backend/middleware/authMiddleware.js).

## Utilities, scripts & tests

- `backend/scripts/` contains helper scripts for backup, user inspection and test flows (e.g. `registerUser.js`, `listUsers.js`, `testLoginEmail.js`).
- Test files in the backend root like `test-mongo.js`, `testEmail.cjs`, `testUserFlow.cjs` help validate services.
- Logging helper: [backend/utils/logger.js](backend/utils/logger.js)

## Payments & Invoicing

- The app generates invoices using [backend/utils/invoiceGenerator.js](backend/utils/invoiceGenerator.js) and logs Email/Invoice events in `backend/models/Invoice.js` and `backend/models/EmailLog.js`.

## Deployment

This repository includes containerization and deployment configs:

- `Dockerfile` and `backend/Dockerfile` — build images for frontend/backend
- `docker-compose.yml` — compose file for local or simple production deployments
- `nginx.conf` — example reverse proxy config
- `vercel.json` and `railway.toml` — deployment hints for Vercel/Railway

For a production deploy, build static frontend and serve via Nginx or a CDN, while running the backend as a separate service connected to a managed MongoDB instance.

## Troubleshooting

- If the backend fails to connect, check `MONGO_URI` and that MongoDB is reachable.
- If emails don't send, verify SMTP credentials and check `backend/utils/emailService.js` for provider configuration.
- Use `backend/scripts/inspectUser.js` to inspect user documents and permissions.

## Contributing

Contributions are welcome. Suggested workflow:

1. Create an issue describing the change.
2. Create a feature branch from `main`.
3. Open a PR with a clear description and testing steps.

Be mindful of secrets — never commit `.env` files or credentials.

## References & useful files

- API docs: [docs/API.md](docs/API.md)
- Backend entry: [backend/server.js](backend/server.js)
- DB config: [backend/config/db.js](backend/config/db.js)
- Frontend entry: [index.tsx](index.tsx) and [App.tsx](App.tsx)
- Docker Compose: [docker-compose.yml](docker-compose.yml)

---

If you'd like, I can:

- Add a short quick-start script to `package.json` to run frontend+backend together
- Expand the API docs in `docs/API.md` with example requests
- Add health-checks and a minimal `README.md` for `backend/`

Let me know which additions you'd like next.
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
