# ANVYRA Backend

This document provides quickstart, environment variable, and CI/CD guidance for the ANVYRA backend service.

## Quickstart (Local)

1. Copy the environment sample and update values:

   cp ../documentation/.env.sample .env
   # or on Windows PowerShell
   Copy-Item ..\documentation\.env.sample .env

2. Edit `.env` and set real values for:
   - APP_JWT_SECRET
   - SPRING_DATASOURCE_PASSWORD

3. Build and run:

   ./mvnw.cmd -DskipTests=true clean package
   java -jar target/backend-0.0.1-SNAPSHOT.jar

## Required environment variables

The backend reads configuration from Spring properties which can be set via environment variables. Below are the most important values:

- APP_ENV (dev | staging | prod) — default: dev
- APP_JWT_SECRET — HS256 secret; MUST be at least 32 bytes when APP_ENV=prod
- APP_JWT_EXPIRES_MS — access token TTL in milliseconds (default 900000 = 15m)
- APP_JWT_REFRESH_EXPIRES_MS — refresh token TTL in milliseconds (default 2592000000 = 30d)
- SPRING_DATASOURCE_URL — JDBC URL for PostgreSQL
- SPRING_DATASOURCE_USERNAME
- SPRING_DATASOURCE_PASSWORD
- SPRING_REDIS_HOST (optional)
- SPRING_REDIS_PORT (optional)

See `documentation/.env.sample` for a full example.

## Production secret management (recommended)

- Do NOT commit secrets to source control. Use a secrets manager such as AWS Secrets Manager, HashiCorp Vault, or GitHub Secrets.
- In production, set APP_ENV=prod and ensure APP_JWT_SECRET is a secure random string of at least 32 bytes.
- Use the CI/CD pipeline to inject secrets into the runtime environment rather than baking them into images.

## GitHub Actions example (CI) — build and test

Below is a minimal GitHub Actions workflow showing how to configure secrets for CI, without committing secrets into the repo. Place this as `.github/workflows/ci.yml` in your repository (example only):

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      APP_ENV: prod
      APP_JWT_SECRET: ${{ secrets.APP_JWT_SECRET }}
      APP_JWT_EXPIRES_MS: ${{ secrets.APP_JWT_EXPIRES_MS }}
      APP_JWT_REFRESH_EXPIRES_MS: ${{ secrets.APP_JWT_REFRESH_EXPIRES_MS }}
      SPRING_DATASOURCE_URL: ${{ secrets.SPRING_DATASOURCE_URL }}
      SPRING_DATASOURCE_USERNAME: ${{ secrets.SPRING_DATASOURCE_USERNAME }}
      SPRING_DATASOURCE_PASSWORD: ${{ secrets.SPRING_DATASOURCE_PASSWORD }}

    steps:
      - uses: actions/checkout@v4
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '21'
      - name: Build with Maven
        run: ./mvnw -B -DskipTests=true clean package

# Notes:
# 1. Configure the repository secrets (Settings -> Secrets) with secure values.
# 2. For integration tests requiring DB, use service containers or Testcontainers and store DB creds in secrets.
```

## How to configure GitHub repository secrets

1. Go to your repository on GitHub.
2. Settings -> Secrets -> Actions -> New repository secret.
3. Add the following secrets (example names):
   - APP_JWT_SECRET
   - APP_JWT_EXPIRES_MS
   - APP_JWT_REFRESH_EXPIRES_MS
   - SPRING_DATASOURCE_URL
   - SPRING_DATASOURCE_USERNAME
   - SPRING_DATASOURCE_PASSWORD

## Injecting secrets from AWS Secrets Manager (example)

- In production, run a sidecar or init script that fetches secrets from AWS Secrets Manager and exports them as environment variables before the JVM starts. Avoid storing secrets on disk unencrypted.

## Next steps

- Configure automated deployments to your target environment and ensure the runtime environment has the required secrets available.
- Optionally integrate HashiCorp Vault or another secrets management system.

