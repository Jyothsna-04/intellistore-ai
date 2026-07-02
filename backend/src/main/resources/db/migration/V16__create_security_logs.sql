-- =============================================================================
-- V16: Create security_logs table
-- Milestone: M1 - Authentication Security & Governance
-- =============================================================================

CREATE TABLE security_logs (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID, -- Can be null for unauthenticated events
    email           VARCHAR(255),
    event_type      VARCHAR(100)    NOT NULL, -- FAILED_LOGIN, REPEATED_FAILED_LOGIN, ACCOUNT_LOCKED, PRIVILEGE_ESCALATION, SENSITIVE_SHARE, POLICY_VIOLATION
    severity        VARCHAR(50)     NOT NULL, -- INFO, LOW, MEDIUM, HIGH, CRITICAL
    description     TEXT            NOT NULL,
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_security_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

COMMENT ON TABLE security_logs IS 'Tracks security violations, locked accounts, and suspicious activities';
CREATE INDEX idx_security_logs_created ON security_logs(created_at DESC);
CREATE INDEX idx_security_logs_type ON security_logs(event_type);
CREATE INDEX idx_security_logs_severity ON security_logs(severity);
