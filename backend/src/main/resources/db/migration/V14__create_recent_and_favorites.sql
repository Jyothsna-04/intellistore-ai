-- =============================================================================
-- V14: Create recent_files and favorites tables
-- Milestone: M2 - Enterprise Storage & M3 - Dashboard
-- =============================================================================

CREATE TABLE favorites (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID            NOT NULL,
    file_id         UUID,
    folder_id       UUID,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_file FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_folder FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
    CONSTRAINT chk_favorite_target CHECK (
        (file_id IS NOT NULL AND folder_id IS NULL) OR
        (file_id IS NULL AND folder_id IS NOT NULL)
    ),
    CONSTRAINT uq_favorite_file_user UNIQUE (user_id, file_id),
    CONSTRAINT uq_favorite_folder_user UNIQUE (user_id, folder_id)
);

CREATE TABLE recent_files (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID            NOT NULL,
    file_id         UUID            NOT NULL,
    accessed_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_recent_files_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_recent_files_file FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);

COMMENT ON TABLE favorites IS 'Tracks user favorited files and folders';
COMMENT ON TABLE recent_files IS 'Tracks user file access logs for quick access history';
CREATE INDEX idx_recent_user_accessed ON recent_files(user_id, accessed_at DESC);
