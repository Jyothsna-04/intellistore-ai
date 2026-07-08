# Contributing to IntelliStore AI 🤝

Thank you for your interest in contributing to **IntelliStore AI**! Whether you are fixing a bug, adding a new feature, or improving documentation, we welcome your pull requests.

---

## 🚀 How to Contribute

### 1. Fork & Clone
Fork the repository on GitHub and clone your fork locally:
```bash
git clone https://github.com/your-username/intellistore-ai.git
cd intellistore-ai
```

### 2. Create a Feature Branch
Create a branch for your work:
```bash
git checkout -b feature/amazing-new-feature
```

### 3. Make Your Changes
Make your changes in the appropriate directory:
- `frontend/`: React + Vite UI components and hooks
- `backend/`: Java Spring Boot controllers, services, and entities
- `ai-service/`: Python FastAPI and LangGraph agents

### 4. Test Your Code
Ensure your changes compile and run cleanly without errors:
- Frontend: `npm run build`
- Backend: `mvn clean test`

### 5. Commit & Push
Use descriptive commit messages:
```bash
git commit -m "feat: add amazing new feature"
git push origin feature/amazing-new-feature
```

### 6. Open a Pull Request
Open a Pull Request on GitHub against the `main` branch. Provide a brief summary of what your PR adds or fixes.

---

## 💡 Code Style & Guidelines
- Keep code clean, readable, and well-structured.
- Avoid committing sensitive API keys or `.env` secrets.
- Update documentation (`README.md` or `/docs`) if adding new features.


The Quality Gate audits:
- Architecture (Clean Architecture, SOLID, DRY)
- Security (JWT, RBAC, secrets, injection protection)
- Frontend (protected routes, role UI, responsive, dark mode)
- Testing (unit, integration, API, auth, authorization)
- Performance (queries, response time, bundle size)
- Documentation (all docs match implementation)
- Code quality (smells, dead code, duplicates, debt)

**Output scores per category (0–100). Overall ≥ 80 required to proceed.**

---

## Release Strategy (Semantic Versioning)

| Version | Milestone | Description |
|---|---|---|
| v0.1.0 | Sprint 0 | Project Foundation |
| v0.2.0 | Milestone 1 | Authentication & User Management |
| v0.3.0 | Milestone 2 | Enterprise Storage Management |
| v0.4.0 | Milestone 3 | Enterprise Dashboard |
| v0.5.0 | Milestone 4 | Search & Metadata Engine |
| v0.6.0 | Milestone 5 | Sharing & Collaboration |
| v0.7.0 | Milestone 6 | Analytics & Reports |
| v0.8.0 | Milestone 7 | Notification System |
| v0.9.0 | Milestone 8 | AI Foundation |
| v1.0.0 | Milestone 9 | AI Storage Copilot |
| v1.1.0 | Milestone 10 | Enterprise Administration |
| v1.2.0 | Milestone 11 | Production Hardening |
| v2.0.0 | Milestone 12 | Enterprise Release |

---

## Git Branching Workflow

```
main                    ← Protected. Production-ready only.
│
├── develop             ← Integration branch.
│
├── feature/auth        ← M1 Authentication
├── feature/storage     ← M2 Storage Management
├── feature/dashboard   ← M3 Dashboard
├── feature/search      ← M4 Search & Metadata
├── feature/sharing     ← M5 Sharing & Collaboration
├── feature/analytics   ← M6 Analytics & Reports
├── feature/notifications ← M7 Notifications
├── feature/ai-foundation ← M8 AI Foundation
├── feature/copilot     ← M9 AI Storage Copilot
├── feature/admin       ← M10 Administration
│
├── release/v1.0        ← Release candidate branch
└── release/v2.0        ← Enterprise release candidate
```

### Branch Naming Convention

```
feature/{milestone-name}
fix/{issue-id}-{short-description}
refactor/{component-name}
docs/{document-name}
test/{test-scope}
release/v{major}.{minor}
hotfix/v{major}.{minor}.{patch}
```

---

## Commit Message Convention (Conventional Commits)

```
feat(auth): implement JWT authentication with refresh token rotation
feat(storage): add MinIO file upload with progress tracking
feat(dashboard): add storage health score widget
fix(auth): resolve refresh token expiration on concurrent requests
fix(storage): prevent path traversal in file upload validation
refactor(search): extract search criteria into specification pattern
docs(api): update authentication endpoint documentation
test(auth): add integration tests for token refresh flow
chore(deps): upgrade Spring Boot to 3.3.4
security(auth): enforce rate limiting on login endpoint
```

---

## Branch → Merge → Release Flow

```
1. Create feature branch from develop
2. Implement milestone
3. Run Quality Gate
4. Resolve all Critical issues
5. Open PR to develop
6. Code review
7. Merge to develop
8. Create release branch from develop
9. Final QA on release branch
10. Merge to main
11. Tag with version (v0.X.0)
12. Update CHANGELOG.md
13. Generate release notes
```

---

## Code Standards

### Backend (Java / Spring Boot)
- Clean Architecture: Controller → Service → Repository
- No business logic in Controllers
- Entities never escape Service layer (use DTOs)
- All DB operations in Transactions
- All inputs validated at Controller boundary
- All exceptions handled by GlobalExceptionHandler
- SLF4J logging only (no System.out)
- No hardcoded config values
- No `TODO` in production code

### Frontend (React / TypeScript)
- Strict TypeScript (no `any` without comment)
- All routes protected with ProtectedRoute
- Role-based component visibility
- Error boundaries on all page sections
- Skeleton loaders on all async data
- No secrets in frontend source
- All API calls through service layer

### AI Service (Python / FastAPI)
- Supervisor orchestrates, specialists execute
- All inputs sanitized before LLM
- Responses validated before returning
- No internal prompts exposed
- API keys via environment variables only

---

## Security Checklist (Pre-Merge)

- [ ] No API keys, secrets, or passwords committed
- [ ] Environment variables configured, not hardcoded
- [ ] JWT authentication enforced on all protected endpoints
- [ ] RBAC verified for all role-restricted endpoints
- [ ] Input validation on all request parameters and bodies
- [ ] File uploads: MIME type, extension, and size validated
- [ ] Audit log entry created for security-relevant actions
- [ ] Rate limiting applied to sensitive endpoints
- [ ] No stack traces in API error responses

---

## Documentation Requirements

After every milestone, update:

| Document | Trigger |
|---|---|
| README.md | Any setup change |
| PROJECT_PROGRESS.md | Every milestone completion |
| CHANGELOG.md | Every version release |
| API_DOCUMENTATION.md | Any endpoint added/changed |
| DATABASE_SCHEMA.md | Any schema change |
| ARCHITECTURE.md | Any structural change |
| DECISIONS.md | Any architectural decision |
| KNOWN_ISSUES.md | Any bug or tech debt |
| TESTING.md | Any new test category |
| SECURITY.md | Any security change |

---

*Last updated: Project Foundation — v0.1.0*
