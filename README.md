# ANVYRA — Premium Fashion E-Commerce Platform

Built For Legacy. A production-quality full-stack e-commerce platform.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Java 21, Spring Boot 3.5.3, Spring Security, JWT |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Container | Docker, Docker Compose |

## Quick Start

### Prerequisites
- Node.js 20+
- Java 21+
- Docker & Docker Compose

### Local Development (Docker)

```bash
# 1. Copy environment variables
cp .env.example .env
# Edit .env and set APP_JWT_SECRET to a strong 64+ char secret

# 2. Start all services
docker compose up -d

# Frontend → http://localhost:3000
# Backend API → http://localhost:8080/api
# API Docs → http://localhost:8080/swagger-ui/index.html
```

### Local Development (Without Docker)

**Backend:**
```bash
cd backend
# Start PostgreSQL on port 5432 and Redis on port 6379
export DB_PASSWORD=yourpassword
export APP_JWT_SECRET=YourSecretKeyMinimum64CharactersLongForHS256
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
cp .env.local.example .env.local   # already created
npm install
npm run dev
```

### Run Tests

```bash
# Backend tests (H2 in-memory, no external services needed)
cd backend
./mvnw test -Dspring.profiles.active=test

# Frontend type check
cd frontend
npx tsc --noEmit
```

## API Documentation

Swagger UI is available at `http://localhost:8080/swagger-ui/index.html` when running.

## Environment Variables

See `.env.example` for all required variables.

### Required for production:
- `APP_JWT_SECRET` — minimum 64 character random string
- `DB_PASSWORD` — PostgreSQL password
- `CORS_ALLOWED_ORIGINS` — comma-separated list of allowed frontend origins

### Required for payment gateway (non-COD):
- `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` — for Razorpay
- OR `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` — for Stripe

## Architecture

```
ANVYRA/
├── frontend/          Next.js 16 App Router
│   ├── app/           Pages (home, shop, product, cart, checkout, orders, account)
│   ├── components/    Shared UI components
│   ├── services/      API client service layer
│   ├── store/         Zustand state management
│   └── providers/     React context providers
├── backend/           Spring Boot REST API
│   └── src/main/java/com/anvyra/
│       ├── controller/   REST endpoints
│       ├── service/      Business logic
│       ├── repository/   Data access
│       ├── entity/       JPA entities
│       ├── dto/          Data transfer objects
│       ├── mapper/       Entity ↔ DTO mappers
│       ├── config/       Security, Redis, CORS config
│       ├── security/     JWT filter, UserDetails
│       └── exception/    Global error handling
└── docker-compose.yml  All services orchestration
```
