-- =============================================================================
-- V10: Create files table
-- Milestone: M2 - Enterprise Storage
-- =============================================================================

CREATE TABLE files (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(255)    NOT NULL,
    original_name       VARCHAR(255)    NOT NULL,
    folder_id           UUID,
    owner_id            UUID            NOT NULL,
    minio_object_key    VARCHAR(512)    NOT NULL,
    mime_type           VARCHAR(255)    NOT NULL,
    size_bytes          BIGINT          NOT NULL,
    checksum_sha256     VARCHAR(64)     NOT NULL,
    storage_tier        VARCHAR(50)     NOT NULL DEFAULT 'HOT', -- HOT, WARM, COLD, ARCHIVE
    is_duplicate        BOOLEAN         NOT NULL DEFAULT FALSE,
    duplicate_of_id     UUID,
    classification      VARCHAR(100),
    classification_conf DOUBLE PRECISION,
    version_number      INTEGER         NOT NULL DEFAULT 1,
    is_current_version  BOOLEAN         NOT NULL DEFAULT TRUE,
    access_count        BIGINT          NOT NULL DEFAULT 0,
    last_accessed_at    TIMESTAMPTZ,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,

    CONSTRAINT fk_files_folder FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL,
    CONSTRAINT fk_files_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_files_duplicate FOREIGN KEY (duplicate_of_id) REFERENCES files(id) ON DELETE SET NULL,
    CONSTRAINT chk_file_size CHECK (size_bytes >= 0)
);

COMMENT ON TABLE files IS 'File metadata stored in database, referencing actual object in MinIO';
CREATE INDEX idx_files_folder ON files(folder_id);
CREATE INDEX idx_files_owner ON files(owner_id);
CREATE INDEX idx_files_tier ON files(storage_tier);
CREATE INDEX idx_files_checksum ON files(checksum_sha256);
CREATE INDEX idx_files_deleted ON files(deleted_at) WHERE deleted_at IS NULL;
