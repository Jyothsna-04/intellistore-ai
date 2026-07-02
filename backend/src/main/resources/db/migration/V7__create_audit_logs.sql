-- =============================================================================
-- V7: Create audit_logs table
-- Milestone: M1 - Authentication (also used across all milestones)
-- =============================================================================

CREATE TABLE audit_logs (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID,
    email           VARCHAR(255),
    action          VARCHAR(100)    NOT NULL,
    resource_type   VARCHAR(100)    NOT NULL,
    resource_id     VARCHAR(255),
    details         TEXT,
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    status          VARCHAR(50)     NOT NULL, -- SUCCESS, FAILED
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE audit_logs IS 'System audit logs for tracking user actions';
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
