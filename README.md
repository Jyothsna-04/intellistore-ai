# IntelliStore AI – Enterprise Storage Optimization Platform using Agentic AI

[![Live Frontend Demo](https://img.shields.io/badge/Live%20Demo-Vercel-blue?style=for-the-badge&logo=vercel)](https://intellistore-ai.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-green?style=for-the-badge&logo=render)](https://intellistore-ai.onrender.com/)
[![AI Microservice](https://img.shields.io/badge/AI%20Service-Render-purple?style=for-the-badge&logo=python)](https://intellistore-ai-service.onrender.com/)

> **Live Production App**: **[https://intellistore-ai.vercel.app](https://intellistore-ai.vercel.app/)**  
> **NOT A CLONE OF GOOGLE DRIVE OR DROPBOX.**  
> **IntelliStore AI is an autonomous, AI-powered Enterprise Storage Optimization Platform inspired by NetApp, Pure Storage, Microsoft SharePoint, Dropbox Business, AWS S3, and modern AI-powered enterprise software.**

---

## 🌟 Product Differentiator & Recruiter Demonstration Goal

If a recruiter asks:  
*"What makes IntelliStore AI different from Google Drive or Dropbox?"*

**The answer is simple and demonstrable:**  
While Google Drive and Dropbox primarily provide passive cloud storage and file sharing, **IntelliStore AI continuously analyzes enterprise storage using autonomous AI agents to optimize storage utilization, improve security, reduce operational costs, predict future storage requirements, enhance compliance, and generate measurable business recommendations.**

It behaves like an experienced **Enterprise Storage Administrator** who proactively works to improve storage health without requiring manual intervention.

---

## 🧠 Core AI Philosophy: The 3 Mandatory Questions

Every autonomous AI Agent in IntelliStore AI must answer **three mandatory questions** before producing any recommendation:
1. **What enterprise problem exists?** (e.g., duplicate files consuming expensive NVMe storage)
2. **What action should be taken?** (e.g., move 2,450 inactive files from HOT to COLD/ARCHIVE tier)
3. **What measurable business benefit will the organization receive?** (e.g., reclaim 6.2 TB, saving $180.50/month)

*If these questions cannot be answered, the recommendation is never generated.*

---

## 📊 AI Success & Enterprise Health Metrics

The AI system continuously calculates and maintains 19 critical enterprise metrics:
1. **Storage Health Score (0–100)**
2. **Optimization Score**
3. **Security Score**
4. **Storage Efficiency Score**
5. **Compliance Score**
6. **Monthly Storage Cost**
7. **Estimated Annual Cost**
8. **Potential Cost Savings**
9. **Recoverable Storage**
10. **Duplicate File Percentage**
11. **Inactive Data Percentage**
12. **Cold Storage Percentage**
13. **Compression Opportunity**
14. **Predicted Storage Growth**
15. **Storage Trend**
16. **Optimization Tasks Pending**
17. **Completed Optimization Tasks**
18. **Risk Level**
19. **Overall Enterprise Health Score**

---

## 🏗️ Polyglot Architecture & Tech Stack

IntelliStore AI follows strict enterprise software engineering standards across a polyglot microservices architecture:

- **Frontend (`/frontend`)**: React 18, Vite, TypeScript, Tailwind CSS, Recharts, Lucide Icons (Dark Glassmorphism UI)
- **Core Backend (`/backend`)**: Java 21, Spring Boot 3.3, Spring Security, JWT, JPA/Hibernate, Flyway Migrations, MinIO SDK, Apache Tika
- **AI Orchestration Service (`/ai-service`)**: Python 3.11+, FastAPI, LangGraph Supervisor Pattern, LangChain, Sentence Transformers, Qdrant Client, OpenAI / Ollama Fallback Engine
- **Enterprise Infrastructure (Docker Compose)**:
  - **PostgreSQL 15** (Relational metadata, users, audit & security logs)
  - **MinIO** (S3-compatible object storage with quarantine bucket)
  - **Redis 7** (Token blacklisting & high-speed caching)
  - **Qdrant** (Vector database for semantic similarity and duplicate detection)
  - **ClamAV** (Antivirus heuristic scanning daemon)
  - **Mailpit** (SMTP notification engine)

---

## 🚀 Quick Start (Docker Compose)

1. **Clone & Configure**:
   ```bash
   git clone https://github.com/Jyothsna-04/intellistore-ai.git
   cd intellistore-ai
   cp .env.example .env.local
   ```
2. **Start Enterprise Infrastructure**:
   ```bash
   docker-compose up -d db minio redis qdrant clamav mailpit
   ```
3. **Run Services**:
   - **Backend**: `cd backend && mvn spring-boot:run` (Runs on port `8085`)
   - **AI Service**: `cd ai-service && .\venv\Scripts\uvicorn.exe app.main:app --host 0.0.0.0 --port 8000`
   - **Frontend**: `cd frontend && npm run dev` (Runs on port `5173` or `3000`)

---

## 📚 Documentation Reference

- **[Product Differentiator & AI Philosophy](docs/PRODUCT_DIFFERENTIATOR.md)**
- **[Project Requirements & Vision](docs/PROJECT_REQUIREMENTS.md)**
- **[AI Agent Specification (LangGraph 12-Agent System)](docs/AI_AGENT_SPEC.md)**
- **[Global Engineering Standards](docs/GLOBAL_ENGINEERING_STANDARDS.md)**
- **[Architecture Decision Records (ADR)](docs/DECISIONS.md)**
- **[Project Progress & Verification Report](docs/PROJECT_PROGRESS.md)**
