# IntelliStore AI — Engineering Playbook

> **Version**: 1.0.0 | **Status**: Active | **Owner**: Platform Engineering

---

## 1. Mission Statement

IntelliStore AI is an **enterprise-grade, cloud-native intelligent storage management platform**.  
Every line of code written must meet the standard: *"Would this work on a production demo to a C-suite interviewer?"*  
**No dummy data. No placeholder UI. No hardcoded values. No fake buttons.**

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Browser (React + Vite)                  │
│  Auth Gate → Dashboard → Explorer → AI → Analytics       │
│  Axios + @tanstack/react-query → JWT → Spring API        │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS (Railway Public URL)
┌──────────────────────▼──────────────────────────────────┐
│             Spring Boot Backend (Java 21)                  │
│  Controllers → Services → Repositories → Entities         │
│  JWT + BCrypt + AES-256-GCM + ClamAV + MinIO/S3          │
└──────┬───────────────┬──────────────────┬───────────────┘
       │               │                  │
┌──────▼──┐    ┌───────▼───┐    ┌────────▼──────┐
│PostgreSQL│    │   Redis   │    │  MinIO/Filebase│
│ (RDB)   │    │  (Cache)  │    │  (Object Store)│
└─────────┘    └───────────┘    └───────────────┘
       │
┌──────▼────────────────────────────────────────┐
│        Python FastAPI AI Service               │
│  LangGraph Multi-Agent Supervisor              │
│  LLM + Qdrant Vector DB + Recommendation Engine│
└───────────────────────────────────────────────┘
```

---

## 3. Technology Stack

| Layer           | Technology                        | Version  |
|-----------------|-----------------------------------|----------|
| Frontend        | React + Vite + TypeScript         | React 19 |
| State           | @tanstack/react-query             | v5       |
| HTTP Client     | Axios                             | 1.x      |
| Styling         | Tailwind CSS v4                   | 4.x      |
| Icons           | lucide-react                      | latest   |
| Backend         | Spring Boot                       | 3.x      |
| Language        | Java                              | 21 LTS   |
| Auth            | Spring Security + JWT + BCrypt    |          |
| Encryption      | AES-256-GCM (per-file keys)       |          |
| Virus Scanning  | ClamAV (clamd socket)             |          |
| Object Storage  | MinIO / Filebase S3               |          |
| Database        | PostgreSQL 15                     |          |
| Cache           | Redis 7                           |          |
| AI Runtime      | FastAPI + Python 3.12             |          |
| AI Framework    | LangGraph (multi-agent)           |          |
| Vector DB       | Qdrant                            |          |
| Migrations      | Flyway                            |          |
| Deployment      | Railway                           |          |

---

## 4. Frontend Engineering Standards

### 4.1 No Dummy Data Policy

> **CRITICAL**: This policy is absolute. No exceptions.

- ❌ `const files = [{ id: 'f-101', name: 'Fake.pdf' }]`
- ✅ `const { data: files } = useFiles(folderId)` — always from real API
- Every chart, table, counter, badge, and stat must pull from a real backend API or compute from real data

### 4.2 Data Fetching Pattern

All data fetching follows the **React Query** pattern:

```typescript
// ✅ CORRECT pattern
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { extractData } from '../lib/apiClient';

export const useFiles = (folderId?: string) =>
  useQuery({
    queryKey: ['files', 'folder', folderId ?? 'root'],
    queryFn: async () => {
      const res = await apiClient.get('/api/storage/files', { params: { folderId } });
      return extractData<FileDto[]>(res);
    },
  });

// ❌ FORBIDDEN pattern (useEffect + fetch)
useEffect(() => { fetch('/api/...').then(r => setData(r)) }, []);
```

### 4.3 API Client Contract

- **All requests** go through `src/lib/apiClient.ts`
- **JWT token** is injected automatically via interceptor
- **401 responses** trigger automatic logout and redirect to `/login`
- **Error messages** always surface the backend's `ApiResponse.message` field

### 4.4 Auth Contract

- Login → `POST /api/auth/login` → JWT stored in `localStorage` as `intellistore_token`
- User data stored in `localStorage` as `intellistore_user`
- `AuthProvider` wraps the entire app; `useAuth()` hook for any component needing auth state
- Route guard in `App.tsx` — unauthenticated users see `LoginPage` only

### 4.5 Loading States

Every data-dependent component MUST have:
1. **Loading skeleton / spinner** while `isLoading: true`
2. **Error state** with Retry button when `error !== null`
3. **Empty state** with actionable call-to-action when data is empty

### 4.6 TypeScript Strictness

- **`verbatimModuleSyntax`** is enabled — use `import { type X }` for type-only imports
- **No `any`** in production code (only in legacy stubs pending migration)
- **No unused variables** — build must pass with zero TS errors

---

## 5. Backend Engineering Standards

### 5.1 Controller Layer

Controllers are thin. All business logic lives in Services.

```java
// ✅ CORRECT
@PostMapping("/files")
public ResponseEntity<ApiResponse<FileDto>> uploadFile(
        @RequestParam("file") MultipartFile file,
        @AuthenticationPrincipal UserDetailsImpl user) {
    return ResponseEntity.ok(ApiResponse.success(fileService.uploadFile(file, user)));
}

// ❌ FORBIDDEN — business logic in controller
@PostMapping("/files")
public ResponseEntity<?> uploadFile(...) {
    // Don't do virus scanning, encryption, or MinIO calls here
}
```

### 5.2 Security Chain

Every file upload goes through this mandatory pipeline (enforced in `FileService`):

```
Receive MultipartFile
    → ClamAV Virus Scan (clamd TCP socket)
    → SHA-256 Checksum Computation
    → Duplicate Detection (checksum lookup in PostgreSQL)
    → AES-256-GCM Encryption (per-file key, stored in DB)
    → MinIO Upload (encrypted bytes)
    → Metadata Persist to PostgreSQL
    → AuditLog Write (triggers SSE broadcast)
```

**No step may be skipped.** Security is non-negotiable.

### 5.3 Audit Log Policy

Every significant user action MUST be logged via `AuditLogService.logAction(...)`:

| Action Category | Required Actions |
|-----------------|-----------------|
| Authentication  | LOGIN, LOGOUT, FAILED_LOGIN, PASSWORD_CHANGE |
| Storage         | UPLOAD, DOWNLOAD, DELETE, RESTORE |
| Sharing         | SHARE_CREATE, SHARE_REVOKE, SHARE_ACCESS |
| Administration  | ROLE_CHANGES, APPROVE, REJECT |

The `AuditLogService` automatically broadcasts every log write to connected SSE clients via `SseEventService`. This powers the live Activity Center.

### 5.4 API Response Contract

All API responses use the `ApiResponse<T>` wrapper:

```java
{
  "success": true,
  "message": "Files retrieved successfully",
  "data": [...],
  "timestamp": "2026-07-07T11:00:00Z"
}
```

Never return raw objects from controllers. Always wrap with `ApiResponse.success(data, message)`.

### 5.5 Real-Time (SSE)

The SSE pipeline:
```
User Action → Service Method → AuditLogService.logAction() 
    → AuditLogRepository.save() 
    → SseEventService.broadcastEvent()
    → All connected EventSource clients update in real-time
```

SSE emitters are stored in `ConcurrentHashMap` in `SseEventService` (in-memory). On multi-instance deployments, replace with Redis Pub/Sub.

---

## 6. Database Migration Standards

All schema changes use **Flyway migrations** in `src/main/resources/db/migration/`:

- Naming: `V{n}__{description}.sql` (e.g., `V14__add_sse_events.sql`)
- Migrations are **immutable** — never edit an existing migration
- Every new entity requires a migration file

---

## 7. Environment Variables

### Backend (`application.yml` / Railway)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `REDIS_URL` | ✅ | Redis connection string |
| `MINIO_URL` | ✅ | MinIO or Filebase S3 endpoint |
| `MINIO_ACCESS_KEY` | ✅ | MinIO access key |
| `MINIO_SECRET_KEY` | ✅ | MinIO secret key |
| `JWT_SECRET` | ✅ | Min 32-char secret for JWT signing |
| `JAVA_TOOL_OPTIONS` | ✅ | `-Xmx384m -Xms128m` for Railway 512MB |
| `CLAMAV_HOST` | ⚠️ | ClamAV TCP host (defaults to localhost) |

### Frontend (`.env.production`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Railway backend public URL (no trailing slash) |
| `VITE_AI_API_URL` | ⚠️ | AI service URL (optional, falls back to backend) |

---

## 8. CI/CD & Deployment

### Railway Deployment Checklist

- [ ] Backend: `JAVA_TOOL_OPTIONS=-Xmx384m -Xms128m` set to prevent OOM
- [ ] Backend: All env vars set in Railway Variables panel
- [ ] Frontend: `VITE_API_URL` set in Railway Variables panel
- [ ] Frontend: `npm run build` passes with 0 errors locally before push
- [ ] Flyway migrations run automatically on startup — verify in logs
- [ ] ClamAV service health: `GET /actuator/health` returns `{"status":"UP"}`

### Git Flow

- `main` branch deploys automatically to Railway
- Feature development on `feature/{name}` branches
- PR required before merging to `main`
- Commit messages: `feat:`, `fix:`, `refactor:`, `docs:` prefixes

---

## 9. Definition of Done

A feature is **done** only when ALL of these are true:

- [ ] Every button/control calls a **real backend API**
- [ ] Loading, error, and empty states are implemented
- [ ] `AuditLogService.logAction()` is called for every significant event
- [ ] TypeScript build passes with **0 errors**
- [ ] Feature works on the **Railway production deployment**
- [ ] No hardcoded data, fake timers, or mock responses

---

## 10. Prohibited Patterns

The following patterns are **permanently banned** from this codebase:

```typescript
// ❌ Fake file data
const files = [{ id: 'f-101', name: 'Fake.pdf' }];

// ❌ Simulated progress
setInterval(() => setProgress(p => p + 10), 500);

// ❌ Hardcoded user count
const activeUsers = 1247;

// ❌ Static chart data
const chartData = [{ month: 'Jan', value: 42 }];

// ❌ Non-functional button
<button onClick={() => alert('Coming soon!')}>Analyze</button>

// ❌ useEffect for data fetching (use React Query instead)
useEffect(() => { fetch('/api/files').then(setFiles) }, []);
```

---

## 11. Contact & Ownership

| Area | Owner |
|------|-------|
| Backend Services | Platform Engineering |
| Frontend UI | Frontend Engineering |
| AI Service | AI/ML Engineering |
| Infrastructure | DevOps / SRE |
| Security Audits | Security Engineering |

---

*This playbook is the engineering constitution for IntelliStore AI.*  
*Last updated: 2026-07-07 by Antigravity IDE Agent*
