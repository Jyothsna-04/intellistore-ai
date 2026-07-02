-- =============================================================================
-- V9: Create folders table
-- Milestone: M2 - Enterprise Storage
-- =============================================================================

CREATE TABLE folders (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255)    NOT NULL,
    parent_id       UUID,
    owner_id        UUID            NOT NULL,
    path            TEXT            NOT NULL,
    is_shared       BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,

    CONSTRAINT fk_folders_parent FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE SET NULL,
    CONSTRAINT fk_folders_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

COMMENT ON TABLE folders IS 'Directory structure of the file system';
CREATE INDEX idx_folders_owner ON folders(owner_id);
CREATE INDEX idx_folders_parent ON folders(parent_id);
CREATE INDEX idx_folders_deleted ON folders(deleted_at) WHERE deleted_at IS NULL;
