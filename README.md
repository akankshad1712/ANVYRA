<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,2,5,30&height=240&section=header&text=ANVYRA&fontSize=90&fontColor=C4956A&fontAlignY=42&desc=Dress%20The%20Story&descSize=18&descAlignY=65&descColor=ffffff&animation=fadeIn" width="100%"/>

<br/>

<img src="https://raw.githubusercontent.com/akankshad1712/ANVYRA/master/frontend/public/logos/anvyra-badge.png" width="80" alt="ANVYRA"/>

<br/><br/>

**Premium Indian Fashion E-Commerce · Built by Akanksha Deshmukh**

<br/>

<a href="https://anvyra-klb2.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white"/></a>
<a href="https://anvyra.onrender.com/api"><img src="https://img.shields.io/badge/Backend%20API-46E3B7?style=for-the-badge&logo=render&logoColor=black"/></a>
<a href="https://anvyra.onrender.com/swagger-ui/index.html"><img src="https://img.shields.io/badge/API%20Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black"/></a>
<a href="https://www.linkedin.com/in/akanksha-deshmukh-26210b244/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"/></a>
<a href="https://github.com/akankshad1712/ANVYRA"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/></a>

<br/><br/>

<img src="https://img.shields.io/badge/Next.js_16-000?style=flat-square&logo=nextdotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/>
<img src="https://img.shields.io/badge/Spring_Boot_3.5-6DB33F?style=flat-square&logo=springboot&logoColor=white"/>
<img src="https://img.shields.io/badge/Java_21-ED8B00?style=flat-square&logo=openjdk&logoColor=white"/>
<img src="https://img.shields.io/badge/PostgreSQL_18-4169E1?style=flat-square&logo=postgresql&logoColor=white"/>
<img src="https://img.shields.io/badge/Redis_7-DC382D?style=flat-square&logo=redis&logoColor=white"/>
<img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white"/>
<img src="https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel&logoColor=white"/>
<img src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black"/>

<br/><br/>

<img src="https://img.shields.io/github/stars/akankshad1712/ANVYRA?style=social"/>
<img src="https://img.shields.io/github/forks/akankshad1712/ANVYRA?style=social"/>
<img src="https://img.shields.io/github/last-commit/akankshad1712/ANVYRA?style=social"/>

</div>

---

## About

**ANVYRA** is a production-grade premium Indian fashion e-commerce platform — not a tutorial, not a clone.

Designed, built, and deployed end-to-end by its founder **Akanksha Deshmukh**. Every API, every UI component, every infrastructure decision — built from scratch, live on the internet.

> *"Built For Legacy."*

---

## Live

| Service | URL |
|---|---|
| Frontend | https://anvyra-klb2.vercel.app |
| Backend API | https://anvyra.onrender.com/api |
| API Docs | https://anvyra.onrender.com/swagger-ui/index.html |

---

## Architecture

```
  Browser
    │
    ▼
  Vercel — Next.js 16 · React 19 · TypeScript · Tailwind v4 · Zustand · TanStack Query
    │
    ▼ REST / JSON
  Render — Spring Boot 3.5 · Java 21 · Spring Security · JWT · Hibernate 6
    │               │
    ▼               ▼
  PostgreSQL 18   Redis 7 (Upstash · TLS)
  Render DB       Token Store · API Cache
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|:---:|
| Frontend | Next.js + React + TypeScript | 16 / 19 / 5 |
| Styling | Tailwind CSS + Framer Motion | v4 |
| State | Zustand + TanStack Query | 5.x |
| Backend | Spring Boot + Java | 3.5 / 21 |
| Auth | JWT + Spring Security + Redis | — |
| Database | PostgreSQL + Hibernate | 18 / 6 |
| Cache | Redis (Upstash TLS) | 7 |
| Container | Docker + Docker Compose | — |
| Deploy FE | Vercel | — |
| Deploy BE | Render | — |
| CI/CD | GitHub Actions | — |

---

## Features

| | Feature | Details |
|:---:|---|---|
| 🛍️ | **Shop** | Category · price · sort filters · real-time search |
| 👕 | **Product** | Image gallery · size selector · color picker · reviews |
| 🛒 | **Cart** | Persistent · real-time quantity updates |
| ❤️ | **Wishlist** | Save items · one-click move to cart |
| 📦 | **Orders** | Place · track · full history |
| � | **Checkout** | Multi-step · address book · COD + payment-ready |
| 🔐 | **Auth** | Register · login · JWT + refresh token rotation |
| 👤 | **Account** | Profile · password · addresses |
| 🛠️ | **Admin** | Dashboard stats · product/category/order/user CRUD |
| 📱 | **Responsive** | Mobile-first · all screen sizes |

---

## Project Structure

```
ANVYRA/
├── frontend/                    Next.js 16 · App Router
│   ├── app/
│   │   ├── (public)/            Home · Shop · Product
│   │   ├── (customer)/          Cart · Checkout · Orders · Wishlist
│   │   ├── (auth)/              Login · Register
│   │   └── (admin)/             Dashboard · Products · Orders · Users
│   ├── components/              UI library
│   ├── services/                Typed API clients
│   ├── store/                   Zustand state
│   └── types/                   TypeScript interfaces
│
├── backend/                     Spring Boot 3.5 · Java 21
│   └── src/main/java/com/anvyra/
│       ├── controller/          12 REST controllers
│       ├── service/             Business logic
│       ├── repository/          12 JPA repositories
│       ├── entity/              11 JPA entities
│       ├── dto/                 23 DTOs
│       ├── security/            JWT filter · UserDetails
│       └── config/              CORS · Redis · Security
│
├── scripts/seed.sql             5 categories · 15 products
├── docker-compose.yml           One-command local stack
├── render.yaml                  Render deployment
└── vercel.json                  Vercel deployment
```

---

## API Reference

<details>
<summary><b>24 Endpoints</b></summary>

<br/>

| Method | Endpoint | Access |
|---|---|:---:|
| `POST` | `/api/auth/register` | 🌐 |
| `POST` | `/api/auth/login` | 🌐 |
| `POST` | `/api/auth/refresh` | 🌐 |
| `POST` | `/api/auth/logout` | 🔐 |
| `GET` | `/api/products` | 🌐 |
| `GET` | `/api/products/{id}` | 🌐 |
| `GET` | `/api/categories` | 🌐 |
| `GET` | `/api/cart` | 🔐 |
| `POST` | `/api/cart/items` | 🔐 |
| `PUT` | `/api/cart/items/{id}` | 🔐 |
| `DELETE` | `/api/cart/items/{id}` | 🔐 |
| `GET` | `/api/wishlist` | 🔐 |
| `POST` | `/api/wishlist/{productId}` | 🔐 |
| `POST` | `/api/orders` | 🔐 |
| `GET` | `/api/orders` | 🔐 |
| `GET` | `/api/orders/{id}` | 🔐 |
| `GET` | `/api/addresses` | 🔐 |
| `POST` | `/api/addresses` | 🔐 |
| `GET` | `/api/reviews/product/{id}` | 🌐 |
| `POST` | `/api/reviews` | 🔐 |
| `GET` | `/api/admin/dashboard/stats` | 👑 |
| `POST` | `/api/products` | 👑 |
| `PUT` | `/api/products/{id}` | 👑 |
| `PATCH` | `/api/orders/{id}/status` | 👑 |

🌐 Public · 🔐 JWT · 👑 Admin

</details>

---

## Quick Start

**Docker:**
```bash
git clone https://github.com/akankshad1712/ANVYRA.git
cd ANVYRA
cp .env.example .env
docker compose up -d
# Frontend → http://localhost:3000
# API      → http://localhost:8080/api
```

**Manual:**
```bash
# Backend
cd backend
export DB_PASSWORD=yourpassword
export APP_JWT_SECRET=AtLeast64CharacterSecretKey!!
./mvnw spring-boot:run

# Frontend
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api" > .env.local
npm install && npm run dev
```

---

## Environment Variables

**Backend**

| Variable | Purpose |
|---|---|
| `DB_URL` | PostgreSQL JDBC URL |
| `DB_USERNAME` | DB username |
| `DB_PASSWORD` | DB password |
| `APP_JWT_SECRET` | JWT key (64+ chars) |
| `REDIS_URL` | `rediss://` TLS URL |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origin |

**Frontend**

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

---

## The Founder

<div align="center">

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   AKANKSHA DESHMUKH                                          ║
║   Founder · Brand Architect · Full Stack Engineer            ║
║                                                              ║
║   ◈ Designed the brand identity & visual language            ║
║   ◈ Built the entire Spring Boot backend API                 ║
║   ◈ Built the complete Next.js frontend from scratch         ║
║   ◈ Designed PostgreSQL schema & Redis caching layer         ║
║   ◈ Configured Docker, CI/CD, and cloud deployment           ║
║   ◈ Deployed to Vercel + Render — live on the internet       ║
║                                                              ║
║   "ANVYRA is not just a project.                             ║
║    It is the brand I am building."                           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

<br/>

<a href="https://www.linkedin.com/in/akanksha-deshmukh-26210b244/"><img src="https://img.shields.io/badge/LinkedIn-Akanksha%20Deshmukh-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"/></a>
&nbsp;
<a href="https://github.com/akankshad1712"><img src="https://img.shields.io/badge/GitHub-akankshad1712-181717?style=for-the-badge&logo=github&logoColor=white"/></a>

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,2,5,30&height=120&section=footer&text=Built%20For%20Legacy&fontSize=22&fontColor=C4956A&fontAlignY=65&animation=fadeIn" width="100%"/>

*Crafted with ambition and zero shortcuts — Akanksha Deshmukh*

</div>
