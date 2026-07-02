# IntelliStore AI - Setup Wizard

Welcome to IntelliStore AI! This project is an enterprise-grade cloud storage optimization platform powered by Agentic AI. We have automated the setup process so you can go from zero to a fully running local environment with a single command.

## Architecture

This project uses a production-grade local stack powered by Docker Compose v2:

*   **Spring Boot (Backend):** REST API, JWT Authentication, File Processing, Encryption, Virus Scan pipeline.
*   **React + Vite (Frontend):** Responsive UI (served via Nginx in Docker).
*   **FastAPI (AI Service):** Dedicated microservice for embeddings, document parsing, and semantic search.
*   **PostgreSQL:** Relational database for metadata, users, and audit logs.
*   **MinIO:** S3-compatible object storage for file uploads and isolation quarantine.
*   **Redis:** High-speed caching, rate-limiting, and session management.
*   **Qdrant:** Vector database for AI embeddings and semantic search.
*   **ClamAV:** Virus scanning daemon (`clamd`) over TCP.
*   **Mailpit:** Local SMTP testing and email preview UI.

## Prerequisites

Before running the setup, ensure you have the following installed on your machine:

1.  **Docker & Docker Compose v2** (e.g., Docker Desktop)
2.  **Git**
3.  *(Optional for local development outside Docker)* Java 17+, Maven 3.8+, Node.js 20+, Python 3.11+

## Quick Start (Automated Setup)

We provide automated bootstrap scripts that perform the entire setup adhering to our **Vibecodeshit** engineering standards:
1. Verify dependencies (Docker).
2. **Dynamically generate secure, random development secrets** into `.env.local` (never committing hardcoded passwords).
3. Launch the entire Docker Compose infrastructure with isolated networks and persistent volumes.
4. Automatically initialize MinIO buckets (`files` and `quarantine`).
5. **Intelligently wait and poll** until all 9 containers reach a `healthy` state before finishing.

### Windows (PowerShell)

Open PowerShell as Administrator (if required for Docker) and run:

```powershell
.\bootstrap.ps1
```

### macOS / Linux (Bash)

Open your terminal and run:

```bash
chmod +x bootstrap.sh
./bootstrap.sh
```

## Running & Accessing Services

Once the bootstrap script confirms all containers are healthy, you can access your local stack:

| Service | URL / Port | Credentials / Notes |
| :--- | :--- | :--- |
| **Frontend UI** | [http://localhost:3000](http://localhost:3000) | Main application interface |
| **Backend API Docs** | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) | OpenAPI / Swagger documentation |
| **FastAPI AI Service** | [http://localhost:8000/docs](http://localhost:8000/docs) | AI microservice API docs |
| **MinIO Console** | [http://localhost:9001](http://localhost:9001) | See `MINIO_ROOT_USER` / `PASSWORD` in `.env.local` |
| **Mailpit Web UI** | [http://localhost:8025](http://localhost:8025) | View outgoing system emails |
| **PostgreSQL** | `localhost:5432` | See `.env.local` for generated password |
| **Redis** | `localhost:6379` | Standard Redis protocol |
| **Qdrant Dashboard** | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) | Vector DB web viewer |

## Secret Management

*   **`.env.example`**: Committed to Git. Lists all required configuration variables with placeholder values.
*   **`.env.local`**: Generated automatically on your first run. Contained within `.gitignore` and holds your actual 256-bit randomly generated keys. **Never commit this file.**
*   To regenerate your credentials, delete `.env.local` and your Docker volumes (`docker compose down -v`), then re-run the bootstrap script.
