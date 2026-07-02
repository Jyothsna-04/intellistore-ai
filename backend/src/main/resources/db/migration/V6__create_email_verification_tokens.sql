-- =============================================================================
-- V6: Create email_verification_tokens table
-- Milestone: M1 - Authentication
-- =============================================================================

CREATE TABLE email_verification_tokens (
    id          BIGSERIAL       PRIMARY KEY,
    user_id     UUID            NOT NULL,
    token       VARCHAR(255)    NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ     NOT NULL,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_email_verification_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

COMMENT ON TABLE email_verification_tokens IS 'Stores email verification tokens for new registrations';
CREATE INDEX idx_email_verification_tokens_token ON email_verification_tokens(token);
