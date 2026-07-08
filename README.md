# IntelliStore AI ⚡ — Enterprise Storage Optimizer Platform powered by Agentic AI

An autonomous **Agentic AI** Enterprise Storage Optimization Platform powered by a LangGraph multi-agent supervisor system that continuously analyzes files, optimizes storage tiers, reduces cloud costs, secures organizational data, and delivers instant HTML email alerts via **Resend**.

[![Live Frontend Demo](https://img.shields.io/badge/Live%20Demo-Vercel-blue?style=for-the-badge&logo=vercel)](https://intellistore-ai.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-green?style=for-the-badge&logo=render)](https://intellistore-ai.onrender.com/)
[![AI Microservice](https://img.shields.io/badge/AI%20Service-Render-purple?style=for-the-badge&logo=python)](https://intellistore-ai-service.onrender.com/)

---

## ✨ Key Features

* **🧠 Agentic AI Multi-Agent Architecture**: Powered by a LangGraph multi-agent supervisor that autonomous AI agents use to analyze storage health, detect duplicates, and generate actionable cost-saving recommendations.
* **🤖 Autonomous Storage Tiering**: Automatically identifies inactive files and recommends migrations from Hot NVMe storage to Cold S3 Archive storage to reduce monthly invoices.
* **💡 Explainable AI (XAI)**: Every optimization recommendation includes clear reasoning, cost-impact analysis, and rollback guarantees.
* **📧 Real-time Email Notifications (Resend)**: Sends enterprise HTML email alerts directly to users for account verification, password resets, and instant file/folder sharing notifications.
* **📂 Enterprise File Sharing & RBAC**: Upload, organize, and share files and folders securely with role-based access control (Admin, Manager, User).
* **🔍 Semantic & Keyword Search**: Fast file discovery powered by vector similarity search (Qdrant) and PostgreSQL metadata indexing.
* **📊 Real-time Executive Dashboard**: Monitor storage quotas, cost savings, duplicate files, and security health scores in real time.

---

## 🛠️ Technology Stack

| Component | Technology | Cloud Hosting |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS | [Vercel](https://intellistore-ai.vercel.app/) |
| **Backend API** | Java 17, Spring Boot 3, Spring Security, Flyway | [Render](https://intellistore-ai.onrender.com/) |
| **Agentic AI Service** | Python 3.11, FastAPI, LangGraph Supervisor | [Render](https://intellistore-ai-service.onrender.com/) |
| **Database** | PostgreSQL 15 | Supabase Cloud |
| **Cache & Sessions** | Serverless Redis | Upstash Cloud |
| **Object Storage** | S3-Compatible Decentralized Blob Storage | Filebase S3 |
| **Vector Index** | Qdrant Vector Database | Qdrant Cloud |
| **Email Delivery Engine** | Resend HTTP REST API | Resend Cloud |

---

## 🚀 Quickstart (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/Jyothsna-04/intellistore-ai.git
cd intellistore-ai
```

### 2. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run the Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
Backend API runs on port `8085`.

### 4. Run the AI Microservice (FastAPI)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## 📄 License

This project is open-source and available under the MIT License.
