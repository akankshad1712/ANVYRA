<div align="center">
<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:000000,50:1a1a2e,100:8B6914&height=200&section=header&text=ANVYRA&fontSize=80&fontColor=ffffff&fontAlignY=38&desc=Dress%20The%20Story&descAlignY=60&descColor=C4956A&animation=fadeIn" width="100%"/>

<br/>

<p>
  <img src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&weight=700&size=22&pause=1000&color=C4956A&center=true&vCenter=true&width=600&lines=Premium+Indian+Fashion+E-Commerce;Built+by+Akanksha+Deshmukh;Next.js+%2B+Spring+Boot+%2B+PostgreSQL;Full+Stack+%7C+Production+Deployed+%7C+Live" alt="Typing SVG" />
</p>

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_LIVE_DEMO-anvyra--klb2.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://anvyra-klb2.vercel.app)
&nbsp;
[![Backend](https://img.shields.io/badge/⚡_BACKEND_API-anvyra.onrender.com-00C7B7?style=for-the-badge&logo=render&logoColor=white)](https://anvyra.onrender.com/api)
&nbsp;
[![API Docs](https://img.shields.io/badge/📖_API_DOCS-Swagger_UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://anvyra.onrender.com/swagger-ui/index.html)

<br/>

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.5-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java_21-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_18-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis_7-DC382D?style=flat-square&logo=redis&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black)

<br/>

[![Stars](https://img.shields.io/github/stars/akankshad1712/ANVYRA?style=social&label=Star%20the%20repo)](https://github.com/akankshad1712/ANVYRA/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/akankshad1712/ANVYRA?style=social)](https://github.com/akankshad1712/ANVYRA/commits/master)

</div>

---

<br/>

## 🏷️ &nbsp; What is ANVYRA?

<table>
<tr>
<td>

**ANVYRA** is a real premium Indian fashion brand — not a tutorial, not a clone.

Every product, every API, every deployment decision was made by **one person**: founder and engineer **Akanksha Deshmukh**.

This is a production-grade full-stack platform with live deployment, real infrastructure, JWT authentication, Redis caching, and a Spring Boot REST API serving a Next.js storefront.

</td>
<td align="center" width="260">

```
╔═══════════════════╗
║                   ║
║    A N V Y R A    ║
║                   ║
║  Dress the Story  ║
║                   ║
║  Built For Legacy ║
║                   ║
╚═══════════════════╝
```

</td>
</tr>
</table>

<br/>

---

## 🏗️ &nbsp; System Architecture

```
  ╔══════════════════════════════════════════════════════════════════╗
  ║                        USER / BROWSER                           ║
  ╚══════════════════════════╤═══════════════════════════════════════╝
                             │  HTTPS
  ╔══════════════════════════▼═══════════════════════════════════════╗
  ║                   VERCEL  (Global CDN)                           ║
  ║                                                                  ║
  ║   Next.js 16   ·   React 19   ·   TypeScript 5                   ║
  ║   Tailwind CSS v4   ·   Zustand   ·   TanStack Query             ║
  ║   Framer Motion   ·   shadcn/ui                                  ║
  ╚══════════════════════════╤═══════════════════════════════════════╝
                             │  REST / JSON
  ╔══════════════════════════▼═══════════════════════════════════════╗
  ║                 RENDER  (Docker Container)                       ║
  ║                                                                  ║
  ║   Spring Boot 3.5   ·   Java 21   ·   Spring Security           ║
  ║   JWT Auth   ·   Hibernate 6   ·   Actuator                     ║
  ╚═══════════════╤══════════════════════════╤════════════════════════╝
                  │                          │
  ╔═══════════════▼══════════╗  ╔════════════▼═════════════════════╗
  ║   PostgreSQL 18           ║  ║   Redis 7 (Upstash · TLS)        ║
  ║   Render Managed DB       ║  ║   Token store · API cache        ║
  ╚══════════════════════════╝  ╚══════════════════════════════════╝
```

<br/>

---

## ✨ &nbsp; Feature Showcase

<div align="center">

| 🛍️ | Feature | Description |
|:---:|---|---|
| 🏠 | **Homepage** | Hero banner, featured collections, new arrivals |
| 🔍 | **Shop & Search** | Filter by category, price range, sort by newest/price |
| 👕 | **Product Detail** | Image gallery, size selector, color picker, reviews |
| 🛒 | **Cart** | Real-time cart, quantity updates, persistent per user |
| ❤️ | **Wishlist** | Save items, one-click move to cart |
| 📦 | **Orders** | Place orders, track status, full order history |
| 💳 | **Checkout** | Multi-step flow, address book, COD + payment-ready |
| 👤 | **Account** | Profile, password update, address management |
| 🔐 | **Auth** | Register, login, JWT + refresh token rotation |
| 🛠️ | **Admin** | Dashboard stats, product/category/order/user CRUD |
| 📱 | **Responsive** | Mobile-first, pixel-perfect on all screen sizes |
| ⚡ | **Performance** | Redis caching, TanStack Query, optimized images |

</div>

<br/>

---

## 🗂️ &nbsp; Project Structure

```
ANVYRA/
│
├── 🖥️  frontend/                          Next.js 16 · App Router
│   ├── app/
│   │   ├── (public)/                      Home · Shop · Product Detail
│   │   ├── (customer)/                    Cart · Checkout · Orders · Wishlist
│   │   ├── (auth)/                        Login · Register
│   │   ├── (admin)/                       Dashboard · Products · Orders · Users
│   │   ├── about/                         Brand story
│   │   └── contact/                       Contact page
│   │
│   ├── components/
│   │   ├── ui/                            Base components (Button, Input, Modal...)
│   │   ├── layout/                        Navbar · Footer · Sidebar
│   │   └── features/                      ProductCard · CartItem · OrderRow...
│   │
│   ├── services/                          Typed API client — one file per domain
│   │   ├── products.service.ts
│   │   ├── cart.service.ts
│   │   ├── orders.service.ts
│   │   ├── auth.service.ts
│   │   └── admin.service.ts
│   │
│   ├── store/                             Zustand global state atoms
│   ├── lib/                               API fetch client · cn utils
│   └── types/                             Shared TypeScript interfaces
│
├── ⚙️  backend/                            Spring Boot 3.5 · Java 21
│   └── src/main/java/com/anvyra/
│       ├── controller/                    12 REST controllers
│       ├── service/                       Business logic layer
│       ├── repository/                    12 JPA repositories
│       ├── entity/                        11 JPA entities
│       ├── dto/                           23 Request / Response DTOs
│       ├── mapper/                        Entity ↔ DTO mappers
│       ├── security/                      JWT filter · UserDetails
│       ├── config/                        CORS · Redis · Security config
│       └── exception/                     Global exception handler
│
├── 📜  scripts/seed.sql                   5 categories · 15 products · sizes · colors
├── 🐳  docker-compose.yml                 Full local stack — one command
├── 📦  render.yaml                        Render IaC deployment
└── 🚀  vercel.json                        Vercel root directory config
```

<br/>

---

## 🔌 &nbsp; API Reference

<details>
<summary><b>▶ &nbsp; Expand — 24 Live Endpoints</b></summary>

<br/>

| Method | Endpoint | Access | Description |
|---|---|:---:|---|
| `POST` | `/api/auth/register` | 🌐 | Create new account |
| `POST` | `/api/auth/login` | 🌐 | Login & receive JWT tokens |
| `POST` | `/api/auth/refresh` | 🌐 | Rotate access token |
| `POST` | `/api/auth/logout` | 🔐 | Invalidate session in Redis |
| `GET` | `/api/products` | 🌐 | Paginated · filtered · sorted |
| `GET` | `/api/products/{id}` | 🌐 | Full product detail |
| `GET` | `/api/categories` | 🌐 | All active categories |
| `GET` | `/api/cart` | 🔐 | User's active cart |
| `POST` | `/api/cart/items` | 🔐 | Add item to cart |
| `PUT` | `/api/cart/items/{id}` | 🔐 | Update quantity |
| `DELETE` | `/api/cart/items/{id}` | 🔐 | Remove cart item |
| `GET` | `/api/wishlist` | 🔐 | User's wishlist |
| `POST` | `/api/wishlist/{productId}` | 🔐 | Toggle wishlist item |
| `POST` | `/api/orders` | 🔐 | Place order |
| `GET` | `/api/orders` | 🔐 | Order history |
| `GET` | `/api/orders/{id}` | 🔐 | Order detail |
| `GET` | `/api/addresses` | 🔐 | Saved addresses |
| `POST` | `/api/addresses` | 🔐 | Add new address |
| `GET` | `/api/reviews/product/{id}` | 🌐 | Product reviews |
| `POST` | `/api/reviews` | 🔐 | Submit review |
| `GET` | `/api/admin/dashboard/stats` | 👑 | Live revenue & order stats |
| `POST` | `/api/products` | 👑 | Create product |
| `PUT` | `/api/products/{id}` | 👑 | Update product |
| `PATCH` | `/api/orders/{id}/status` | 👑 | Update order status |

<br/>

🌐 Public &nbsp;&nbsp;·&nbsp;&nbsp; 🔐 JWT Required &nbsp;&nbsp;·&nbsp;&nbsp; 👑 Admin Role Only

**Interactive docs →** https://anvyra.onrender.com/swagger-ui/index.html

</details>

<br/>

---

## 🚀 &nbsp; Quick Start

### 🐳 &nbsp; Docker — everything in one command

```bash
git clone https://github.com/akankshad1712/ANVYRA.git
cd ANVYRA
cp .env.example .env
# Edit .env — set DB_PASSWORD and APP_JWT_SECRET (64+ chars)
docker compose up -d
```

| Service | URL |
|---|---|
| 🖥️ Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:8080/api |
| 📖 Swagger | http://localhost:8080/swagger-ui/index.html |

<br/>

### 💻 &nbsp; Manual Setup

```bash
# ── Backend (needs Postgres:5432 + Redis:6379) ──
cd backend
export DB_PASSWORD=your_password
export APP_JWT_SECRET=AtLeast64CharacterSecretKeyHere12345678901234567890
./mvnw spring-boot:run

# ── Frontend ──
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api" > .env.local
npm install && npm run dev
```

<br/>

---

## 🔑 &nbsp; Environment Variables

<table>
<tr>
<td width="50%">

**Backend**

| Variable | Purpose |
|---|---|
| `DB_URL` | PostgreSQL JDBC URL |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `APP_JWT_SECRET` | JWT key (64+ chars) |
| `REDIS_URL` | `rediss://` TLS URL |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origin |

</td>
<td width="50%">

**Frontend**

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

**Deployment**

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Render PostgreSQL |
| Cache | Upstash Redis |

</td>
</tr>
</table>

<br/>

---

## 👤 &nbsp; The Founder

<div align="center">

```
  ╔════════════════════════════════════════════════════════════════╗
  ║                                                                ║
  ║     ✦  AKANKSHA DESHMUKH  ✦                                    ║
  ║                                                                ║
  ║     Founder · Designer · Full Stack Engineer                   ║
  ║                                                                ║
  ║     ▸ Designed the brand identity & visual language            ║
  ║     ▸ Architected and built the entire backend API             ║
  ║     ▸ Built the complete Next.js frontend from scratch         ║
  ║     ▸ Configured Docker, CI/CD, and cloud deployment           ║
  ║     ▸ Ships alone. Owns everything.                            ║
  ║                                                                ║
  ║     ❝ ANVYRA is not just a project.                            ║
  ║       It is the brand I am building. ❞                         ║
  ║                                                                ║
  ╚════════════════════════════════════════════════════════════════╝
```

[![GitHub](https://img.shields.io/badge/github.com%2Fakankshad1712-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/akankshad1712)

</div>

<br/>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:8B6914,50:1a1a2e,100:000000&height=120&section=footer&text=Built%20For%20Legacy&fontSize=24&fontColor=C4956A&fontAlignY=65&animation=fadeIn" width="100%"/>

<br/>

[![Stars](https://img.shields.io/github/stars/akankshad1712/ANVYRA?style=social)](https://github.com/akankshad1712/ANVYRA/stargazers)
&nbsp;&nbsp;
[![Forks](https://img.shields.io/github/forks/akankshad1712/ANVYRA?style=social)](https://github.com/akankshad1712/ANVYRA/network/members)
&nbsp;&nbsp;
[![Last Commit](https://img.shields.io/github/last-commit/akankshad1712/ANVYRA?style=social)](https://github.com/akankshad1712/ANVYRA/commits/master)

<br/>

*Made with craft, ambition, and zero shortcuts.*
*— Akanksha Deshmukh, Founder of ANVYRA*

</div>
