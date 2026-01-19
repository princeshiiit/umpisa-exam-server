# Docker Setup for UMPISA Exam Server

## Prerequisites

- Docker Desktop for Mac installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

1. **Build and start the containers:**
   ```bash
   docker compose up -d
   ```

2. **Run database migrations:**
   ```bash
   docker compose exec app node ace migration:run
   ```

3. **Access the application:**
   - API: http://localhost:3333
   - PostgreSQL: localhost:5432

## Docker Commands

### Start services
```bash
docker compose up -d
```

### Stop services
```bash
docker compose down
```

### View logs
```bash
docker compose logs -f app
```

### Rebuild after code changes
```bash
docker compose up -d --build
```

### Run migrations
```bash
docker compose exec app node ace migration:run
```

### Run seeds
```bash
docker compose exec app node ace db:seed
```

### Access app container shell
```bash
docker compose exec app sh
```

### Access PostgreSQL
```bash
docker compose exec postgres psql -U postgres -d umpisa_exam
```

## Environment Variables

Create a `.env` file in the root directory with your configuration. Use `.env.example` as a template.

Key variables for Docker:
- `APP_KEY`: Your application key
- `DB_USER`: Database user (default: postgres)
- `DB_PASSWORD`: Database password (default: postgres)
- `DB_DATABASE`: Database name (default: umpisa_exam)

## Development vs Production

### Development Mode (with hot reload)
For development, you can use a bind mount to enable hot reload:

```yaml
# Add this to the app service in docker-compose.yml
volumes:
  - .:/app
  - /app/node_modules
command: ["node", "ace", "serve", "--hmr"]
```

### Production Mode
The default configuration is optimized for production with multi-stage builds.

## Troubleshooting

### Database connection issues
Make sure the database container is healthy:
```bash
docker compose ps
```

### Port conflicts
If port 3333 or 5432 is already in use, modify the port mappings in `docker-compose.yml`.

### Clear everything and start fresh
```bash
docker compose down -v
docker compose up -d --build
```
