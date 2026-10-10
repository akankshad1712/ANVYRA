<div align="center">

```
 █████╗ ███╗   ██╗██╗   ██╗██╗   ██╗██████╗  █████╗
██╔══██╗████╗  ██║██║   ██║╚██╗ ██╔╝██╔══██╗██╔══██╗
███████║██╔██╗ ██║██║   ██║ ╚████╔╝ ██████╔╝███████║
██╔══██║██║╚██╗██║╚██╗ ██╔╝  ╚██╔╝  ██╔══██╗██╔══██║
██║  ██║██║ ╚████║ ╚████╔╝    ██║   ██║  ██║██║  ██║
╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═══╝     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
```

### ✦ &nbsp; D R E S S &nbsp; T H E &nbsp; S T O R Y &nbsp; ✦

<br/>

[![Live](https://img.shields.io/badge/◉%20LIVE%20DEMO-anvyra--klb2.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white&labelColor=111111)](https://anvyra-klb2.vercel.app)
&nbsp;
[![API](https://img.shields.io/badge/⚡%20BACKEND%20API-anvyra.onrender.com-00C7B7?style=for-the-badge&logo=render&logoColor=white&labelColor=111111)](https://anvyra.onrender.com/api)
&nbsp;
[![Swagger](https://img.shields.io/badge/📖%20API%20DOCS-Swagger%20UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black&labelColor=111111)](https://anvyra.onrender.com/swagger-ui/index.html)

<br/>

![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot%203.5-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL%2018-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis%207-DC382D?style=flat-square&logo=redis&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript%205-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

<br/>

---

*A production-quality, founder-built premium Indian fashion e-commerce platform.*
*Not a tutorial. Not a clone. A real brand — engineered from zero.*

---

</div>

<br/>

## ◈ &nbsp;The Brand

**ANVYRA** is a premium Indian fashion label built for those who wear their story.

Founded and engineered by **Akanksha Deshmukh** — every line of code, every product card, every pixel of this platform was built from scratch. No templates. No shortcuts. Full-stack, production-deployed, and live on the internet.

> *"Built For Legacy."*

<br/>

---

## ◈ &nbsp;Live URLs

<div align="center">

| ✦ | Service | URL |
|:---:|---|---|
| 🛍️ | **Frontend** | [anvyra-klb2.vercel.app](https://anvyra-klb2.vercel.app) |
| ⚙️ | **Backend API** | [anvyra.onrender.com/api](https://anvyra.onrender.com/api) |
| 📖 | **Swagger Docs** | [anvyra.onrender.com/swagger-ui](https://anvyra.onrender.com/swagger-ui/index.html) |
| 💻 | **GitHub** | [akankshad1712/ANVYRA](https://github.com/akankshad1712/ANVYRA) |

</div>

<br/>

---

## ◈ &nbsp;Tech Stack

<div align="center">

```
┌─────────────────────────────────────────────────────────────┐
│                        ANVYRA STACK                         │
├──────────────────┬──────────────────────────────────────────┤
│  FRONTEND        │  Next.js 16 · React 19 · TypeScript 5    │
│  STYLING         │  Tailwind CSS v4 · Framer Motion         │
│  STATE           │  Zustand · TanStack Query v5             │
│  BACKEND         │  Spring Boot 3.5 · Java 21               │
│  AUTH            │  JWT · Spring Security · Redis Sessions  │
│  DATABASE        │  PostgreSQL 18 · Hibernate 6             │
│  CACHE           │  Redis 7 (Upstash serverless)            │
│  CONTAINER       │  Docker · Docker Compose                 │
│  DEPLOY (FE)     │  Vercel                                  │
│  DEPLOY (BE)     │  Render                                  │
│  CI/CD           │  GitHub Actions                          │
└──────────────────┴──────────────────────────────────────────┘
```

</div>

<br/>

---

## ◈ &nbsp;Features

<table>
<tr>
<td width="50%">

### 🛍️ Shopping
- Product catalog with filters (category, price, sort)
- Product detail — gallery, sizes, colors, reviews
- Smart search across all collections
- Featured & new arrivals on homepage
- Mobile-first responsive design

### 🔐 Authentication
- Register & login with email + password
- JWT access tokens + refresh token rotation
- Redis-backed token invalidation
- Protected routes — customer & admin

</td>
<td width="50%">

### 🛒 Cart & Orders
- Real-time cart with quantity management
- Persistent cart tied to user account
- Multi-step checkout + address book
- Full order history & status tracking
- COD support — payment gateway ready

### 🛠️ Admin Dashboard
- Live stats (revenue, orders, users, products)
- Full product CRUD with image management
- Category management
- Order status management
- User listing & management

</td>
</tr>
</table>

<br/>

---

## ◈ &nbsp;Architecture

```
ANVYRA/
│
├── 🖥️  frontend/                        Next.js 16 App Router
│   ├── app/
│   │   ├── (public)/                    Home · Shop · Product Detail
│   │   ├── (customer)/                  Cart · Checkout · Orders · Wishlist
│   │   ├── (auth)/                      Login · Register
│   │   └── (admin)/                     Dashboard · Products · Orders · Users
│   ├── components/                      Reusable UI components
│   ├── services/                        API client layer (typed endpoints)
│   ├── store/                           Zustand global state
│   ├── lib/                             API client · utilities
│   └── types/                           TypeScript definitions
│
├── ⚙️  backend/                          Spring Boot REST API
│   └── src/main/java/com/anvyra/
│       ├── controller/                  12 REST controllers
│       ├── service/                     Business logic layer
│       ├── repository/                  12 JPA repositories
│       ├── entity/                      11 JPA entities
│       ├── dto/                         23 Request/Response DTOs
│       ├── security/                    JWT filter · UserDetails
│       ├── config/                      Security · Redis · CORS
│       └── exception/                   Global exception handler
│
├── 🗄️  scripts/
│   └── seed.sql                         15 products · 5 categories
│
├── 🐳  docker-compose.yml               Full local stack
├── 📦  render.yaml                      Render deployment config
└── 🚀  vercel.json                      Vercel deployment config
```

<br/>

---

## ◈ &nbsp;API Reference

<details>
<summary><b>Click to expand full API table</b></summary>

<br/>

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create account |
| `POST` | `/api/auth/login` | Public | Login + get tokens |
| `POST` | `/api/auth/refresh` | Public | Refresh access token |
| `POST` | `/api/auth/logout` | Auth | Invalidate tokens |
| `GET` | `/api/products` | Public | List products (paginated, filterable) |
| `GET` | `/api/products/{id}` | Public | Single product detail |
| `GET` | `/api/categories` | Public | All categories |
| `GET` | `/api/cart` | Auth | Get user cart |
| `POST` | `/api/cart/items` | Auth | Add item to cart |
| `PUT` | `/api/cart/items/{id}` | Auth | Update quantity |
| `DELETE` | `/api/cart/items/{id}` | Auth | Remove item |
| `GET` | `/api/wishlist` | Auth | Get wishlist |
| `POST` | `/api/wishlist/{productId}` | Auth | Add to wishlist |
| `POST` | `/api/orders` | Auth | Place order |
| `GET` | `/api/orders` | Auth | Order history |
| `GET` | `/api/orders/{id}` | Auth | Order detail |
| `GET` | `/api/reviews/product/{id}` | Public | Product reviews |
| `POST` | `/api/reviews` | Auth | Post review |
| `GET` | `/api/admin/dashboard/stats` | Admin | Live dashboard stats |
| `GET` | `/api/admin/products` | Admin | All products (incl. inactive) |
| `POST` | `/api/products` | Admin | Create product |
| `PUT` | `/api/products/{id}` | Admin | Update product |
| `DELETE` | `/api/products/{id}` | Admin | Delete product |
| `PATCH` | `/api/orders/{id}/status` | Admin | Update order status |

Full interactive docs → **https://anvyra.onrender.com/swagger-ui/index.html**

</details>

<br/>

---

## ◈ &nbsp;Quick Start

### 🐳 &nbsp;With Docker — one command

```bash
git clone https://github.com/akankshad1712/ANVYRA.git
cd ANVYRA
cp .env.example .env
# Set DB_PASSWORD and APP_JWT_SECRET in .env
docker compose up -d
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api |
| Swagger | http://localhost:8080/swagger-ui/index.html |

<br/>

### 💻 &nbsp;Without Docker

**Backend** (needs PostgreSQL on 5432 + Redis on 6379):
```bash
cd backend
export DB_PASSWORD=yourpassword
export APP_JWT_SECRET=YourSecretKeyMinimum64CharactersLong
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api" > .env.local
npm install
npm run dev
```

<br/>

---

## ◈ &nbsp;Environment Variables

### Backend
| Variable | Description |
|---|---|
| `DB_URL` | PostgreSQL JDBC connection URL |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `APP_JWT_SECRET` | JWT signing key (min 64 chars) |
| `REDIS_URL` | Redis URL (`rediss://` for TLS) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed frontend origins |

### Frontend
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

<br/>

---

## ◈ &nbsp;Deployment

```
GitHub (master branch)
        │
        ├──▶  Vercel           →  Frontend (Next.js)
        │         ↓
        │     anvyra-klb2.vercel.app
        │
        └──▶  Render           →  Backend (Spring Boot / Docker)
                  ↓
              anvyra.onrender.com
                  │
                  ├── Render PostgreSQL 18
                  └── Upstash Redis 7
```

<br/>

---

## ◈ &nbsp;The Founder

<div align="center">

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   Akanksha Deshmukh                                  │
│   Founder · Designer · Full Stack Engineer           │
│                                                      │
│   Built ANVYRA end-to-end:                           │
│   Brand identity → UI/UX → Frontend → Backend        │
│   Database → Auth → Cache → Docker → CI → Cloud      │
│                                                      │
│   "ANVYRA is not just a project.                     │
│    It's the brand I'm building."                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

[![GitHub](https://img.shields.io/badge/github.com/akankshad1712-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/akankshad1712)

</div>

<br/>

---

<div align="center">

**If this impressed you, star the repo ⭐**

[![Stars](https://img.shields.io/github/stars/akankshad1712/ANVYRA?style=social)](https://github.com/akankshad1712/ANVYRA/stargazers)
&nbsp;
[![Forks](https://img.shields.io/github/forks/akankshad1712/ANVYRA?style=social)](https://github.com/akankshad1712/ANVYRA/network/members)

<br/>

*Made with craft, ambition, and zero shortcuts.*
*— Akanksha Deshmukh, Founder of ANVYRA*

</div>
