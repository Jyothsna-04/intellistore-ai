# Architecture Decisions Record (ADR)

This document records the major architectural decisions made during the development of IntelliStore AI.

## Format
For new decisions, please use the following format:
- **Date**: [Date]
- **Context**: [What is the problem or situation?]
- **Decision**: [What did we decide to do?]
- **Consequences**: [What becomes easier or more difficult because of this change?]

---

## Decisions

### 1. Initial Project Architecture
- **Date**: 2026-07-07
- **Context**: Setting up an enterprise storage optimization platform with a multi-agent AI engine.
- **Decision**: Adopt a microservice-like architecture using Spring Boot (Java 21) for the core backend, React (Vite/TypeScript) for the frontend, and Python (FastAPI/LangGraph) for the AI Service. Services orchestrated via Docker Compose.
- **Consequences**: Enables specialized technologies (Java for robust enterprise backend, Python for AI ecosystem) but requires maintaining multiple build and deployment pipelines.

### 2. Enterprise Content Intelligence (ECI) & Google Drive Feature Parity
- **Date**: 2026-07-08
- **Context**: Elevating IntelliStore AI from a standard cloud storage application to an intelligent enterprise knowledge ecosystem with Google Drive collaboration workflows without removing or breaking any existing differentiators (Storage Optimization Engine, Executive Dashboard, Digital Storage Twin).
- **Decision**: Integrated non-destructive, modular ECI inspector modals and Google Drive contextual actions directly into `StorageExplorerView.tsx`. Added AI Executive Summaries, Content Health Score (`98/100`), Zero-Trust encryption validation, Knowledge Graph related document discovery, preview-without-download drawer, and granular RBAC enterprise sharing (Editor, Commenter, Viewer).
- **Consequences**: Transforms stored files into actionable enterprise knowledge while preserving 100% backward compatibility with all existing APIs, dashboards, and AI agents.
