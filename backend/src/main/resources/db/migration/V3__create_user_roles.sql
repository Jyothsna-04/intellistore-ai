-- =============================================================================
-- V3: Create user_roles table
-- Milestone: M1 - Authentication
-- =============================================================================

CREATE TABLE user_roles (
    user_id     UUID            NOT NULL,
    role_id     BIGINT          NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

COMMENT ON TABLE user_roles IS 'Join table for users and roles (M:N)';
