## 2026Spring-Team43-DHES

### Development database configuration

The following are **development** defaults. They should not be used for when this goes into real production:

```yaml
environment:
  POSTGRES_DB: dhes
  POSTGRES_USER: dhes
  POSTGRES_PASSWORD: dhes
```

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/dhes}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:dhes}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:dhes}
```

### Instructions for running Docker containers:

```yaml
docker-compose up --build
```
