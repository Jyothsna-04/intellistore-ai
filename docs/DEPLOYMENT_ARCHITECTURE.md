# IntelliStore AI – Production Deployment Architecture & Portfolio Guide

This document defines the production deployment architecture for **IntelliStore AI**, optimized for free-tier cloud hosting (Railway + Managed Cloud Services) to produce a live, portfolio-ready and interview-ready SaaS demonstration URL.

---

## 1. Multi-Account Railway Deployment Topology

To operate within free-tier resource limits while maintaining strict enterprise microservice separation, services are partitioned across three Railway accounts:

```
[Railway Account 1: User Facing & Core API]
   ├── React Vite Frontend (Static CDN / Nginx Container)
   └── Spring Boot Core Backend (Java 21 / Tomcat - Port 8085)

[Railway Account 2: Intelligence & Relational Metadata]
   ├── Python AI Microservice (FastAPI / LangGraph - Port 8000)
   └── PostgreSQL 15 Database (Primary Metadata Store)

[Railway Account 3: High-Speed Cache & Background Workers]
   └── Redis 7 Cache (Token Blacklist & Session Storage)

[External Managed Cloud Services (Free Tiers)]
   ├── Cloudflare R2 / AWS S3 / MinIO Cloud (Object Storage & Quarantine Bucket)
   ├── Qdrant Cloud Free Tier (Vector Database - 1GB cluster)
   ├── ClamAV Container (Railway / Fly.io / Self-hosted worker)
   └── Resend / SendGrid / Brevo (Production SMTP Notification Engine)
```

---

## 2. Environment Variables & Secret Configuration

### Backend (`application.yml` / Railway Environment)
| Variable | Description | Example / Production Setting |
|---|---|---|
| `SPRING_DATASOURCE_URL` | PostgreSQL connection URL | `jdbc:postgresql://postgres.railway.internal:5432/intellistore` |
| `SPRING_DATASOURCE_USERNAME` | DB Username | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | DB Password | *(Injected via Secret)* |
| `SPRING_DATA_REDIS_HOST` | Redis cache hostname | `redis.railway.internal` |
| `SPRING_DATA_REDIS_PORT` | Redis port | `6379` |
| `MINIO_URL` | Object Storage endpoint | `https://s3.us-east-1.amazonaws.com` or MinIO Cloud URL |
| `MINIO_ACCESS_KEY` | Storage Access Key | *(Injected via Secret)* |
| `MINIO_SECRET_KEY` | Storage Secret Key | *(Injected via Secret)* |
| `AI_SERVICE_URL` | FastAPI LangGraph endpoint | `https://ai-service-production.up.railway.app` |
| `CLAMAV_HOST` | Antivirus daemon host | `clamav.railway.internal` |
| `JWT_SECRET` | 256-bit signing key | *(Injected via Secret)* |

### AI Service (`.env` / Railway Environment)
| Variable | Description | Example / Production Setting |
|---|---|---|
| `QDRANT_URL` | Vector DB cluster URL | `https://xyz-cluster.us-east4-0.gcp.cloud.qdrant.io:6333` |
| `QDRANT_API_KEY` | Qdrant authentication key | *(Injected via Secret)* |
| `EMBEDDING_MODEL` | HuggingFace model string | `all-MiniLM-L6-v2` |
| `LLM_PROVIDER` | Fallback routing engine | `ollama` or `openai` |

---

## 3. Step-by-Step Deployment Assistant Protocol

When deploying to production, follow this verification protocol for each external integration:

### Step A: Qdrant Cloud Vector Database (Free Tier)
1. **Create**: Go to `https://cloud.qdrant.io/` and create a free 1GB cluster.
2. **Copy**: Copy the **Cluster URL** and generate a new **API Key**.
3. **Paste**: Set `QDRANT_URL` and `QDRANT_API_KEY` in Railway Account 2 (AI Service variables).
4. **Verify**: The AI service will automatically execute health checks on startup.

### Step B: Production Email Provider (Resend / Brevo)
1. **Create**: Create a free account on `https://resend.com/` (allows 3,000 free emails/month).
2. **Copy**: Copy your API Key and default SMTP credentials (`smtp.resend.com`, port `465` or `587`).
3. **Paste**: Update `spring.mail.host`, `spring.mail.port`, `spring.mail.username`, and `spring.mail.password` in Railway Account 1.

---

## 4. Automatic Health Verification Checklist

Once all services are deployed, execute the following health endpoints to confirm system readiness:
* [x] **Frontend UI**: Accessible via public HTTPS URL (`https://intellistore-ai.up.railway.app`)
* [x] **Backend API**: `GET https://backend.up.railway.app/api/actuator/health` returns `{"status": "UP"}`
* [x] **Database & Redis**: Spring Boot logs confirm `Connected to PostgreSQL database` and `Redis connection active`
* [x] **AI Service**: `GET https://ai-service.up.railway.app/health` returns `{"status": "healthy", "qdrant": "connected"}`
* [x] **ClamAV Scanner**: Socket ping to port `3310` returns `PONG`

---

## 5. End-to-End Verification Workflow

Before demonstrating to recruiters, verify the complete data lifecycle:
1. **Register & Login**: Create user `demo@intellistore.ai`; verify JWT issuance.
2. **Upload & Quarantine**: Upload test sample; verify ClamAV background scanning and SHA-256 integrity calculation.
3. **Encryption & Storage**: Confirm file is encrypted via AES-256-GCM and stored in Object Storage.
4. **Semantic Search**: Type a natural language query in the search bar; confirm Qdrant vector similarity matching.
5. **AI Copilot**: Ask *"What files can we archive to save money?"*; verify LangGraph Supervisor delegates to Cost & Lifecycle agents and outputs explainable JSON.

---

## 6. Portfolio & Interview Demonstration Mode

To present a resume-ready, enterprise-grade demonstration to recruiters from top technology firms (Google, Microsoft, Amazon, NetApp, Pure Storage):
* **Public Demo Credentials**: Provide pre-configured read-only or sandboxed accounts:
  * **Role**: Storage Administrator (`admin@intellistore.ai` / `DemoAdmin2026!`)
  * **Role**: Enterprise Manager (`manager@intellistore.ai` / `DemoManager2026!`)
* **Pre-Populated Enterprise Data**: Ensure the database is seeded with 50+ sample files across Engineering, HR, Finance, and QA departments with simulated historical access timestamps.
* **Live Explainable AI**: Ensure the "Why This Recommendation?" XAI panel and Digital Storage Twin What-If simulations are front and center on the dashboard landing page.
