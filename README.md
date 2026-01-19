# UMPISA Exam Server

Node.js server application for UMPISA exam management system. Built with AdonisJS v6, PostgreSQL, and Docker.

## Features

- 🔐 JWT-based authentication with access tokens
- 👥 User management with role-based access control (Admin/User)
- 🚀 RESTful API endpoints
- 📚 Auto-generated Swagger documentation
- 🐳 Docker containerization for development and production
- 🔄 Hot reload in development mode
- 🗃️ PostgreSQL database with migrations and seeders

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- Node.js 20+ (for local development without Docker)

## Quick Start

### Production Mode (Recommended)

1. **Build and start containers:**
   ```bash
   docker compose build
   docker compose up -d
   ```

2. **Run migrations:**
   ```bash
   docker compose exec app node ace migration:run
   ```

3. **Run seeders (creates admin user and roles):**
   ```bash
   docker compose exec app node ace db:seed
   ```

4. **Access the application:**
   - API: http://localhost:3333
   - Swagger UI: http://localhost:3333/docs
   - Swagger JSON: http://localhost:3333/swagger
