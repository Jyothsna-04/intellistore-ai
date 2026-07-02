-- =============================================================================
-- V5: Create password_reset_tokens table
-- Milestone: M1 - Authentication
-- =============================================================================

CREATE TABLE password_reset_tokens (
    id          BIGSERIAL       PRIMARY KEY,
    user_id     UUID            NOT NULL,
    token       VARCHAR(255)    NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ     NOT NULL,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

COMMENT ON TABLE password_reset_tokens IS 'Stores temporary tokens for password reset flow';
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
