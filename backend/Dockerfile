# ─── Build stage ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B
COPY src/ src/
RUN ./mvnw -B -DskipTests=true clean package

# ─── Runtime stage ───────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S anvyra && adduser -S anvyra -G anvyra
COPY --from=builder /app/target/*.jar app.jar
USER anvyra
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
