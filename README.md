# Todo Secure App

A full-stack Todo List application built with:

- **Frontend**: React (Vite + TypeScript)
- **Backend**: Spring Boot + PostgreSQL
- **DevOps**: Docker + Docker Compose
- **Security Considerations**: Designed with production hardening in mind (HTTPS, static builds, environment isolation, and build-time dependency locking)

---

## 📦 Project Structure

```
todo-secure-app/
├── backend/               # Spring Boot service
├── frontend/              # React frontend with Vite
├── docker-compose.yml     # Base configuration (production)
├── docker-compose.override.yml # Development override
├── .env                   # Active environment config (auto-copied)
├── .env.development       # Dev settings
├── .env.production        # Prod settings
├── Makefile               # Commands automation
```

---

## 🚀 Getting Started

Make sure you have these installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- GNU `make` (comes by default on macOS/Linux)

---

## Development Mode [to-do]

Start with hot reload (React dev server + Spring Boot dev tools):

```bash
make dev
```

This will:
- Use .env.development as config
- Mount your local frontend/ and backend/ folders
- Enable live reload with Vite and Spring Boot

Your app will be available at:
🔗 http://localhost:3000


## Production Mode

Build and run the app in production mode using Nginx and JAR packaging:

```bash
make prod
```

This will:
- Build static frontend assets via Dockerfile
- Package backend into a runnable JAR
- Serve frontend with Nginx

Your production version will also run on:
🔗 http://localhost:3000

## Common Commands

```bash
make up       # Start with existing .env
make pause    # Pause tha containers
make unpause  # Unpause the containsers
make down     # Stop and remove containers
make logs     # Tail container logs
make ps       # Show running services
make restart  # Shortcut for down + up
```

## Environment Configuration

You can customize ports or DB credentials inside:

- .env.development (for local dev)
- .env.production (for deployment)

The active environment file will be copied to .env by the make command.

## TODO

- Add JWT-based user authentication
- Add request validation and sanitization
- Enable HTTPS reverse proxy
- Add CSRF and rate limiting middleware
- Write E2E tests with Cypress
