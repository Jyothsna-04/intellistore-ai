-- =============================================================================
-- V4: Create refresh_tokens table
-- Milestone: M1 - Authentication
-- =============================================================================

CREATE TABLE refresh_tokens (
    id          BIGSERIAL       PRIMARY KEY,
    user_id     UUID            NOT NULL UNIQUE,
    token       VARCHAR(255)    NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ     NOT NULL,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

COMMENT ON TABLE refresh_tokens IS 'Stores session refresh tokens for token rotation';
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
