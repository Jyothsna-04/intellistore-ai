-- =============================================================================
-- V2: Create users table
-- Milestone: M1 - Authentication
-- =============================================================================

CREATE TABLE users (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    email                   VARCHAR(255)    NOT NULL UNIQUE,
    password_hash           VARCHAR(255)    NOT NULL,
    full_name               VARCHAR(150)    NOT NULL,
    avatar_url              TEXT,
    department              VARCHAR(100),
    job_title               VARCHAR(100),
    is_active               BOOLEAN         NOT NULL DEFAULT TRUE,
    is_email_verified       BOOLEAN         NOT NULL DEFAULT FALSE,
    failed_login_attempts   INTEGER         NOT NULL DEFAULT 0,
    account_locked_until    TIMESTAMPTZ,
    storage_quota_bytes     BIGINT          NOT NULL DEFAULT 10737418240,
    storage_used_bytes      BIGINT          NOT NULL DEFAULT 0,
    last_login_at           TIMESTAMPTZ,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    created_by              UUID,
    deleted_at              TIMESTAMPTZ,

    CONSTRAINT chk_storage_used    CHECK (storage_used_bytes >= 0),
    CONSTRAINT chk_storage_quota   CHECK (storage_quota_bytes > 0),
    CONSTRAINT chk_failed_attempts CHECK (failed_login_attempts >= 0)
);

COMMENT ON TABLE  users                      IS 'Platform users — all roles';
COMMENT ON COLUMN users.storage_quota_bytes  IS 'Max allowed storage in bytes (default 10 GB)';
COMMENT ON COLUMN users.storage_used_bytes   IS 'Current used storage in bytes';
COMMENT ON COLUMN users.deleted_at           IS 'Soft delete timestamp — NULL means active';

CREATE INDEX idx_users_email      ON users(email)      WHERE deleted_at IS NULL;
CREATE INDEX idx_users_department ON users(department) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_active     ON users(is_active)  WHERE deleted_at IS NULL;
