-- =============================================================================
-- V12: Create file_shares table
-- Milestone: M5 - Sharing & Collaboration
-- =============================================================================

CREATE TABLE file_shares (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id         UUID,
    folder_id       UUID,
    shared_by       UUID            NOT NULL,
    shared_with     UUID, -- NULL means public link share
    share_token     VARCHAR(255)    UNIQUE, -- NULL for direct user shares
    password_hash   VARCHAR(255), -- NULL if no password required
    permission      VARCHAR(50)     NOT NULL, -- VIEWER, COMMENTER, EDITOR, MANAGER, OWNER
    expires_at      TIMESTAMPTZ,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_shares_file FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
    CONSTRAINT fk_shares_folder FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
    CONSTRAINT fk_shares_by FOREIGN KEY (shared_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_shares_with FOREIGN KEY (shared_with) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_share_target CHECK (
        (file_id IS NOT NULL AND folder_id IS NULL) OR
        (file_id IS NULL AND folder_id IS NOT NULL)
    )
);

COMMENT ON TABLE file_shares IS 'Tracks file and folder sharing permissions and public link configuration';
CREATE INDEX idx_shares_file ON file_shares(file_id);
CREATE INDEX idx_shares_folder ON file_shares(folder_id);
CREATE INDEX idx_shares_with ON file_shares(shared_with);
CREATE INDEX idx_shares_token ON file_shares(share_token);
