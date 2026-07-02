# Global Engineering Standards

## Philosophy

This document is the single source of truth for engineering practices across the IntelliStore AI project.
Every contributor — human or AI — must follow these standards without exception.

> **Priority Order:** Security → Reliability → Maintainability → Scalability → Performance → Developer Experience

---

## 1. Architecture

### Principles
- **Clean Architecture**: Domain logic is independent of frameworks, UI, and databases.
- **SOLID Principles**: Single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion.
- **DRY**: Never duplicate business logic. Extract shared logic into services or utilities.
- **Separation of Concerns**: Each layer has one clearly defined responsibility.
- **Dependency Injection**: All dependencies injected; no manual instantiation of services.

### Layered Architecture

```
Controller → Service → Repository → Database
```

- **Controllers**: Receive HTTP requests, validate input, call services, return responses. No business logic.
- **Services**: Implement business logic, orchestrate operations, manage transactions.
- **Repositories**: Only access the database. No business logic.
- **DTOs**: All data crossing layer boundaries must use DTOs. Entities never leave the service layer.

### Cross-Cutting Concerns
- Global Exception Handling
- Centralized Logging
- Request/Response Interceptors
- Audit Logging
- Rate Limiting

---

## 2. Security

### Authentication & Authorization
- JWT Access Tokens (short-lived: 15 min)
- Refresh Tokens (longer-lived: 7 days, rotated on use)
- Role-Based Access Control (RBAC)
- Password hashing with BCrypt (cost factor ≥ 12)
- Email verification on registration
- Forgot/reset password with secure tokens
- Session management via Redis token blacklist

### Secret Management
- **Never** commit API keys, passwords, or secrets to version control.
- **Never** log secrets, tokens, or passwords.
- All secrets via environment variables.
- `.env` files excluded from Git via `.gitignore`.

### Input/Output Validation
- Validate all input at the API boundary (not just frontend).
- Reject requests that fail validation immediately with structured error responses.
- Sanitize all outputs to prevent XSS.
- Validate file uploads: MIME type, extension, size, virus scanning hook.

### Protection
- SQL Injection: Use parameterized queries / JPA — never string-concatenated queries.
- XSS: Sanitize HTML output; use Content Security Policy headers.
- CSRF: SameSite cookies; CSRF tokens where applicable.
- Prompt Injection: Validate and sanitize all AI inputs; never concatenate raw user input into system prompts.
- Rate Limiting: Applied per-endpoint and per-user.
- HTTPS: All traffic must be encrypted in production.

### Logging
- Audit Logs: Every user action (file upload, delete, share, login, etc.) logged with user_id, IP, timestamp, action.
- Security Logs: Authentication failures, authorization violations, suspicious file uploads, prompt injection attempts.
- Never log sensitive data (passwords, tokens, PII beyond necessary).

---

## 3. Backend (Spring Boot)

### Standards
- RESTful API design (proper HTTP verbs, status codes, resource naming).
- All endpoints versioned: `/api/v1/`.
- Pagination on all list endpoints (page, size, sort).
- Filtering and sorting support on resource collections.
- Consistent response envelope: `{ "success": true, "data": {}, "message": "", "timestamp": "" }`.
- Transactions on all multi-step database operations (`@Transactional`).
- All entities use UUIDs as primary keys.
- Soft deletes for user data (files, folders, users).
- Database migrations via Flyway.
- Structured logging (JSON in production, readable in development).

### Forbidden
- Business logic in Controllers.
- Direct entity exposure via APIs.
- Raw SQL strings (use JPA/JPQL/named queries).
- `System.out.println()` (use SLF4J/Logback).
- Hardcoded configuration values.
- `TODO` comments in production code.
- Placeholder/stub implementations shipped as complete.

---

## 4. Frontend (React + TypeScript)

### Standards
- TypeScript strict mode enabled.
- All components are typed; no `any` without justification.
- Protected Routes: All authenticated pages require valid JWT.
- Role-Based UI: Components and routes rendered based on user roles.
- Responsive design: Mobile-first, tested at 320px, 768px, 1280px, 1920px.
- Dark Mode: System preference detection + manual toggle.
- Error Boundaries on all major page sections.
- Loading states and skeleton loaders on all async operations.
- Accessible UI: ARIA labels, keyboard navigation, color contrast.
- Reusable component library in `src/components/common/`.
- Environment variables via `.env` files (never hardcoded).

### Token Security
- Access tokens stored in memory (not localStorage).
- Refresh tokens in secure, HttpOnly cookies.
- Tokens never logged or exposed in URLs.
- Automatic token refresh on 401 responses.

### Forbidden
- Secrets or API keys in frontend code.
- Business logic in components (use hooks and services).
- Direct fetch() calls in components (use service layer).
- `any` type without explanation.
- Console.log in production builds.

---

## 5. Database (PostgreSQL)

### Schema Standards
- UUID primary keys (gen_random_uuid()).
- All tables have: `created_at`, `updated_at`, `deleted_at` (for soft deletes).
- All tables have: `created_by` where user context is relevant.
- Foreign key constraints enforced.
- Indexes on: foreign keys, frequently filtered columns, composite query patterns.
- Check constraints for enum-like fields.
- No nullable columns without business justification.
- Comments on tables and columns explaining purpose.

### Migration Standards
- Flyway: `V{version}__{description}.sql` naming.
- Migrations are immutable after merge to main.
- Each migration is independently rollback-safe.
- No destructive migrations without data backup procedure.

### Query Standards
- All queries use parameterized values.
- N+1 queries forbidden: use JOIN FETCH or batch loading.
- Slow query log enabled in production.
- All long-running operations have timeout configuration.

---

## 6. AI Service (FastAPI + LangGraph)

### Architecture
- Supervisor Agent orchestrates specialist agents.
- Each specialist agent has a single, well-defined responsibility.
- Agents communicate via structured JSON state objects.
- New agents can be added without modifying existing agents (Open/Closed Principle).

### Safety
- Input validation before passing to LLM.
- Prompt injection protection on all user-supplied text.
- System prompts never exposed in responses.
- API keys never logged or returned in responses.
- AI responses validated and sanitized before returning to users.
- Hallucination mitigation: ground responses in actual file metadata.

### Explainability
- Every recommendation includes: reasoning, confidence score, agent name.
- Agent execution trace available for debugging and transparency.
- Confidence scores calibrated (0.0–1.0).

### Model Independence
- LLM provider abstracted behind a service interface.
- Supports OpenAI and Ollama without changing agent code.
- Model name configurable via environment variable.

---

## 7. DevOps

### Docker
- Every service has a production-optimized multi-stage Dockerfile.
- Docker Compose orchestrates all services with health checks.
- Service dependencies declared with `depends_on` and health conditions.
- Environment variables passed via `.env` files (not hardcoded in compose).

### Observability
- Structured logging in all services.
- Health check endpoints on all services.
- Metrics hooks for future Prometheus integration.
- Centralized log format: JSON with service name, level, timestamp, correlation_id.

---

## 8. Documentation

### Required Files
All documentation lives in `/docs/`. See `CONTRIBUTING.md` for full list.

### Standards
- Documentation must be updated in the same commit/PR as the code change.
- Never allow documentation to lag behind implementation.
- README.md must always reflect how to run the project from scratch.
- All ADRs recorded in `DECISIONS.md`.
- All known issues recorded in `KNOWN_ISSUES.md`.

---

## 9. Testing

### Coverage Requirements
- Unit Tests: All service methods.
- Integration Tests: All API endpoints.
- Security Tests: Auth, RBAC, input validation, token handling.
- Regression Tests: All previously working features after each milestone.

### Standards
- Tests are isolated: no shared state between tests.
- Test data via fixtures, not production data.
- Mock external dependencies (MinIO, OpenAI) in unit tests.
- Tests must pass before a milestone is considered complete.

---

## 10. Code Review Checklist

Before any code is merged, verify:

- [ ] Architecture: Clean layers, no cross-layer violations.
- [ ] Security: No secrets committed, auth enforced, input validated.
- [ ] Performance: No N+1 queries, no blocking operations.
- [ ] Readability: Self-documenting code, meaningful names.
- [ ] Maintainability: No duplicate logic, modular design.
- [ ] Testing: Relevant tests added and passing.
- [ ] Documentation: Updated to reflect changes.
- [ ] Error Handling: All failure paths handled gracefully.
- [ ] Logging: Appropriate log levels, no sensitive data logged.

---

*Last updated: Milestone 0 – Project Foundation*
