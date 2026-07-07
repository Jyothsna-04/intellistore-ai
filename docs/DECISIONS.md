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
