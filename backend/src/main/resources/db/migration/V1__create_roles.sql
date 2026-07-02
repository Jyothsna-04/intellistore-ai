-- =============================================================================
-- V1: Create roles table
-- Milestone: M1 - Authentication
-- =============================================================================

CREATE TABLE roles (
    id          BIGSERIAL       PRIMARY KEY,
    name        VARCHAR(50)     NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  roles      IS 'Application roles for RBAC';
COMMENT ON COLUMN roles.name IS 'Role name — ROLE_ADMIN, ROLE_MANAGER, ROLE_EMPLOYEE';

CREATE INDEX idx_roles_name ON roles(name);
