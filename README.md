# ANVYRA — Dress the Story

> **Founded & built by Akanksha Deshmukh**

ANVYRA is a premium Indian fashion e-commerce brand — designed, engineered, and owned by its founder from the ground up. Every line of code, every pixel, and every product is a reflection of the brand's identity: bold, minimal, and built for legacy.

---

## What is ANVYRA?

ANVYRA is not a tutorial project. It is a real brand with a real codebase — a production-quality full-stack e-commerce platform built entirely by its founder, Akanksha Deshmukh. Inspired by the vision of building an Indian fashion label that competes at the highest level.

---

## Live Features

| Feature | Description |
|---|---|
| 🛍️ Shop | Browse products with filters, price range, category |
| 🔍 Product Detail | Image gallery, size selector, reviews, add to cart |
| 🛒 Cart | Real-time cart with quantity management |
| ❤️ Wishlist | Save products for later |
| 🔐 Auth | Register, login, JWT + refresh token flow |
| 📦 Orders | Place orders, track status, view history |
| 💳 Checkout | Address management, payment integration ready |
| 👤 Profile | Account settings, address book |
| 🛠️ Admin | Dashboard, product management, order management |
| 📱 Responsive | Mobile-first, works on all screen sizes |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| State | Zustand, TanStack Query |
| Backend | Java 21, Spring Boot 3.5, Spring Security |
| Auth | JWT (access + refresh tokens), Redis token store |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Container | Docker, Docker Compose |
| CI | GitHub Actions |

---

## Project Structure

```
ANVYRA/
├── frontend/                  # Next.js 16 App Router
│   ├── app/
│   │   ├── (public)/          # Home, Shop, Product pages
│   │   ├── (customer)/        # Cart, Checkout, Orders, Profile
│   │   ├── (auth)/            # Login, Register
│   │   └── (admin)/           # Admin dashboard
│   ├── components/            # Reusable UI components
│   ├── services/              # API client layer
│   ├── store/                 # Zustand global state
│   └── types/                 # TypeScript definitions
│
├── backend/                   # Spring Boot REST API
│   └── src/main/java/com/anvyra/
│       ├── controller/        # REST endpoints
│       ├── service/           # Business logic
│       ├── repository/        # Data access (JPA)
│       ├── entity/            # Database models
│       ├── dto/               # Request/response objects
│       ├── security/          # JWT filter, auth config
│       └── config/            # CORS, Redis, security setup
│
└── docker-compose.yml         # One-command local setup
```

---

## Run Locally

### With Docker (easiest)

```bash
# 1. Clone the repo
git clone https://github.com/akankshad1712/ANVYRA.git
cd ANVYRA

# 2. Set environment variables
cp .env.example .env
# Edit .env — set DB_PASSWORD and APP_JWT_SECRET

# 3. Start everything
docker compose up -d

# Frontend → http://localhost:3000
# Backend API → http://localhost:8080/api
# Swagger Docs → http://localhost:8080/swagger-ui/index.html
```

### Without Docker

**Backend:**
```bash
cd backend
# PostgreSQL must be running on port 5432
# Redis must be running on port 6379
export DB_PASSWORD=yourpassword
export APP_JWT_SECRET=YourSecretKeyMinimum64CharactersLong
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

---

## API Documentation

Swagger UI available at `http://localhost:8080/swagger-ui/index.html`

Covers all endpoints: auth, products, categories, cart, wishlist, orders, payments, reviews, admin.

---

## Environment Variables

| Variable | Description |
|---|---|
| `DB_PASSWORD` | PostgreSQL password |
| `APP_JWT_SECRET` | JWT signing key (min 64 chars) |
| `CORS_ALLOWED_ORIGINS` | Frontend URL (e.g. https://anvyra.vercel.app) |
| `NEXT_PUBLIC_API_URL` | Backend API URL for the browser |

See `.env.example` for the full list.

---

## About the Founder

**Akanksha Deshmukh** — Designer, developer, and founder of ANVYRA.

Built this platform end-to-end: brand identity, UI/UX design, frontend development, backend architecture, database design, authentication, and deployment infrastructure.

> *"ANVYRA is not just a project. It's the brand I'm building."*

---

## GitHub

**https://github.com/akankshad1712/ANVYRA**
