<div align="center">

<img src="https://img.shields.io/badge/ANVYRA-Dress%20the%20Story-000000?style=for-the-badge&labelColor=000000&color=8B6914" alt="ANVYRA" />

# ANVYRA — Dress the Story

### Premium Indian Fashion E-Commerce Platform

*Designed, engineered, and owned by its founder from the ground up.*

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-anvyra--klb2.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://anvyra-klb2.vercel.app)
[![Backend API](https://img.shields.io/badge/⚙️%20Backend%20API-anvyra.onrender.com-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://anvyra.onrender.com/api)
[![GitHub](https://img.shields.io/badge/GitHub-akankshad1712-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/akankshad1712/ANVYRA)

---

**Founder & Developer:** Akanksha Deshmukh &nbsp;|&nbsp; **Brand:** ANVYRA &nbsp;|&nbsp; **Stack:** Next.js · Spring Boot · PostgreSQL · Redis

</div>

---

## About

ANVYRA is not a tutorial project. It is a real fashion brand — built entirely by its founder, **Akanksha Deshmukh**, from brand identity to production infrastructure.

Every line of code, every product, and every design decision reflects one goal: build an Indian fashion label that competes at the highest level.

> *"Built For Legacy."*

---

## Live URLs

| Service | URL |
|---|---|
| 🛍️ Frontend | https://anvyra-klb2.vercel.app |
| ⚙️ Backend API | https://anvyra.onrender.com/api |
| 📖 API Docs (Swagger) | https://anvyra.onrender.com/swagger-ui/index.html |

---

## Tech Stack

<div align="center">

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | Next.js + React + TypeScript | 16.x / 19.x / 5.x |
| **Styling** | Tailwind CSS | v4 |
| **State** | Zustand + TanStack Query | 5.x / 5.x |
| **Backend** | Spring Boot + Java | 3.5.x / 21 |
| **Auth** | JWT (Access + Refresh) + Spring Security | — |
| **Database** | PostgreSQL | 18 |
| **Cache** | Redis (Upstash) | 7 |
| **Container** | Docker + Docker Compose | — |
| **Frontend Deploy** | Vercel | — |
| **Backend Deploy** | Render | — |
| **CI** | GitHub Actions | — |

</div>

---

## Features

### 🛍️ Shopping Experience
- Product catalog with category, price, and sort filters
- Product detail pages with image gallery, size selector, color picker
- Search and browse across all collections
- Featured products and new arrivals on homepage

### 🔐 Authentication
- Register and login with email + password
- JWT access tokens + refresh token rotation
- Redis-backed token invalidation on logout
- Protected routes for customer and admin areas

### 🛒 Cart & Checkout
- Real-time cart with quantity management
- Persistent cart tied to user account
- Multi-step checkout with address management
- Order placement with COD support

### ❤️ Wishlist
- Save products for later
- Move from wishlist to cart in one click

### 📦 Orders
- Full order history with status tracking
- Order detail view with item breakdown
- Admin order status management

### 👤 Account
- Profile management and password update
- Address book with multiple saved addresses
- Order history and tracking

### 🛠️ Admin Dashboard
- Dashboard with live stats (revenue, orders, users, products)
- Product CRUD — create, edit, delete, toggle active
- Category management
- Order management with status updates
- User listing and management

### 📱 Design
- Mobile-first responsive design
- Smooth animations with Framer Motion
- Dark-accented premium UI
- Accessible components

---

## Project Structure

```
ANVYRA/
│
├── frontend/                          # Next.js 16 App Router
│   ├── app/
│   │   ├── (public)/                  # Home, Shop, Product pages
│   │   ├── (customer)/                # Cart, Checkout, Orders, Wishlist
│   │   ├── (auth)/                    # Login, Register
│   │   ├── (admin)/                   # Admin dashboard & management
│   │   ├── about/                     # Brand story page
│   │   └── contact/                   # Contact page
│   ├── components/                    # Reusable UI components
│   │   ├── ui/                        # Base components (Button, Input, etc.)
│   │   ├── layout/                    # Navbar, Footer, Sidebar
│   │   └── features/                  # Product cards, Cart items, etc.
│   ├── services/                      # API client layer (all endpoints)
│   ├── store/                         # Zustand global state stores
│   ├── lib/                           # API client, utilities
│   └── types/                         # TypeScript type definitions
│
├── backend/                           # Spring Boot REST API
│   └── src/main/java/com/anvyra/
│       ├── controller/                # REST endpoints (12 controllers)
│       ├── service/                   # Business logic layer
│       ├── repository/                # JPA data access (12 repositories)
│       ├── entity/                    # JPA entities (11 entities)
│       ├── dto/                       # Request/response DTOs
│       ├── mapper/                    # Entity ↔ DTO mappers
│       ├── security/                  # JWT filter, UserDetails service
│       ├── config/                    # Security, Redis, CORS config
│       └── exception/                 # Global exception handler
│
├── scripts/
│   └── seed.sql                       # Database seed (categories + 15 products)
│
├── docker-compose.yml                 # Full local stack (PG + Redis + API + UI)
├── render.yaml                        # Render deployment config
└── vercel.json                        # Vercel deployment config
```

---

## API Overview

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/refresh` | Public |
| GET | `/api/products` | Public |
| GET | `/api/products/{id}` | Public |
| GET | `/api/categories` | Public |
| GET | `/api/cart` | Auth |
| POST | `/api/cart/items` | Auth |
| POST | `/api/orders` | Auth |
| GET | `/api/orders` | Auth |
| GET | `/api/wishlist` | Auth |
| GET | `/api/admin/dashboard/stats` | Admin |
| POST | `/api/products` | Admin |
| PATCH | `/api/orders/{id}/status` | Admin |

Full interactive docs: **https://anvyra.onrender.com/swagger-ui/index.html**

---

## Run Locally

### Option 1 — Docker (one command)

```bash
git clone https://github.com/akankshad1712/ANVYRA.git
cd ANVYRA
cp .env.example .env
# Edit .env — set DB_PASSWORD and APP_JWT_SECRET
docker compose up -d
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api |
| Swagger | http://localhost:8080/swagger-ui/index.html |

### Option 2 — Manual

**Backend** (requires PostgreSQL on 5432 + Redis on 6379):
```bash
cd backend
export DB_PASSWORD=yourpassword
export APP_JWT_SECRET=YourSecretKeyMinimum64CharactersLongForHS256Algorithm
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8080/api
npm install && npm run dev
```

---

## Environment Variables

### Backend
| Variable | Description | Required |
|---|---|---|
| `DB_URL` | PostgreSQL JDBC URL | ✅ |
| `DB_USERNAME` | Database username | ✅ |
| `DB_PASSWORD` | Database password | ✅ |
| `APP_JWT_SECRET` | JWT signing key (min 64 chars) | ✅ |
| `REDIS_URL` | Redis connection URL | ✅ |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed frontend URLs | ✅ |

### Frontend
| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | ✅ |

---

## Deployment

| Layer | Platform | Config File |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | `vercel.json` |
| Backend | [Render](https://render.com) | `render.yaml` |
| Database | Render PostgreSQL | — |
| Cache | [Upstash Redis](https://upstash.com) | — |

---

## About the Founder

**Akanksha Deshmukh**
Founder of ANVYRA. Designed the brand, built the platform, owns the vision.

Built this end-to-end: brand identity, UI/UX, frontend architecture, backend API, database schema, authentication system, caching layer, Docker setup, CI pipeline, and cloud deployment.

> *"ANVYRA is not just a project. It's the brand I'm building."*

---

<div align="center">

**⭐ Star this repo if you find it impressive**

[![GitHub stars](https://img.shields.io/github/stars/akankshad1712/ANVYRA?style=social)](https://github.com/akankshad1712/ANVYRA)

*Made with focus, craft, and ambition by Akanksha Deshmukh*

</div>
