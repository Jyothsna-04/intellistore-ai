# IntelliStore AI – Production Deployment Architecture & Portfolio Guide

This document defines the production deployment architecture for **IntelliStore AI**, hosted on enterprise Forever Free Tier cloud platforms to produce a live, high-performance SaaS demonstration.

---

## 1. Production Deployment Topology

```
[User Browser / Clients]
          │
          ▼  HTTPS / TLS 1.3
[Vercel Global Edge Network] ── React Vite Frontend (https://intellistore-ai.vercel.app)
          │
          ├── REST API / JWT Authentication / Storage Operations
          ▼
[Render Web Service] ────────── Spring Boot Core Backend (https://intellistore-ai.onrender.com)
          │                              │
          │                              ├── PostgreSQL 15 (Supabase Cloud - Tokyo Region)
          │                              ├── Serverless Redis (Upstash Serverless Cache)
          │                              ├── Decentralized S3 Storage (Filebase S3 - intellistore-files)
          │                              └── Real-time Email Engine (Resend REST API)
          │
          ├── AI / NLP / Semantic Search & Recommendations
          ▼
[Render Web Service] ────────── Python AI Microservice (https://intellistore-ai-service.onrender.com)
                                         │
                                         └── Vector Database (Qdrant Cloud Free Tier Cluster)
```

---

## 2. Production Services & Endpoints

| Layer | Platform | Live URL / Host | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | Vercel | `https://intellistore-ai.vercel.app` | Vite + React + Tailwind CSS single-page application |
| **Core API Backend** | Render | `https://intellistore-ai.onrender.com` | Java 17 + Spring Boot 3 + Spring Security + Flyway |
| **AI Microservice** | Render | `https://intellistore-ai-service.onrender.com` | Python FastAPI + LangGraph Supervisor + XAI Engine |
| **Relational Database** | Supabase | `aws-0-ap-northeast-1.pooler.supabase.com:5432` | Managed PostgreSQL 15 database |
| **Session & Token Cache** | Upstash | `pleasing-perch-157992.upstash.io:6379` | Serverless Redis with TLS |
| **Blob Storage** | Filebase | `https://s3.filebase.io` (Bucket: `intellistore-files`) | S3-compatible decentralized storage |
| **Vector Index** | Qdrant Cloud | `b68c0561-40cb-4713-9289-94e47a76bbd2.us-east-1-1.aws.cloud.qdrant.io` | Cosine similarity vector index |
| **Email Delivery** | Resend | `https://api.resend.com/emails` | HTTP REST email engine for notifications |

---

## 3. Key Environment Variables

### Core Backend (`intellistore-ai.onrender.com`)
- `DB_HOST`: `aws-0-ap-northeast-1.pooler.supabase.com`
- `DB_PORT`: `5432`
- `DB_NAME`: `postgres`
- `DB_USER`: `postgres.gpupmwenawgehlitcizq`
- `MINIO_URL`: `https://s3.filebase.io`
- `MINIO_BUCKET`: `intellistore-files`
- `RESEND_API_KEY`: `re_...`
- `AI_SERVICE_URL`: `https://intellistore-ai-service.onrender.com`

### Frontend (`intellistore-ai.vercel.app`)
- `VITE_API_URL`: `https://intellistore-ai.onrender.com`
- `VITE_AI_API_URL`: `https://intellistore-ai-service.onrender.com`

---

## 4. Portfolio & Interview Demonstration Mode

To present a resume-ready, enterprise-grade demonstration to recruiters:
* **Public Live Application**: `https://intellistore-ai.vercel.app`
* **Real-time File & Folder Sharing**: Create folders, invite team members, and manage access tiers.
* **Explainable AI Recommendations**: Interactive "Why This Recommendation?" XAI analysis and tier migrations.

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
