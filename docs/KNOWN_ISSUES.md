# Known Issues & Architectural Notes

This document tracks known issues, bugs, resolutions, and technical debt in the IntelliStore AI project.

## Resolved Issues

### 1. Port 8080 Conflict on Windows (Resolved: 2026-07-07)
- **Symptom**: When running Spring Boot locally via `mvn spring-boot:run`, the application failed to start with `Web server failed to start. Port 8080 was already in use`.
- **Cause**: Windows system services (such as Jenkins or Oracle running in Session 0 under PID 5188/6736) often occupy port 8080 and cannot be terminated without administrative privileges.
- **Resolution**: Updated `backend/src/main/resources/application.yml` and `docker-compose.yml` to default to `server.port: ${SERVER_PORT:8085}`. The backend now runs cleanly on port `8085` locally and in Docker without conflicting with host system services.

### 2. SecurityLog Entity Schema Mismatch (Resolved: 2026-07-07)
- **Symptom**: Spring Boot startup failed with `PropertyReferenceException: No property 'resolvedAt' found for type 'SecurityLog'`.
- **Cause**: The JPA entity class `SecurityLog.java` was missing properties corresponding to the database schema defined in `V16__create_security_logs.sql` (`severity`, `resolved_at`, `event_type`, etc.).
- **Resolution**: Updated `SecurityLog.java` to include all database columns with proper JPA `@Column` annotations and getters/setters.

## Current Technical Debt / Minor Notes
- **Frontend API Wiring**: The React frontend currently utilizes mock state for immediate UI/UX responsiveness and prototyping. Subsequent integration sprints will wire the Axios clients directly to `http://localhost:8085/api` (Backend) and `http://localhost:8000` (AI Service).
