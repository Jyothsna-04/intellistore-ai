-- =============================================================================
-- V8: Insert default roles
-- Milestone: M1 - Authentication
-- =============================================================================

INSERT INTO roles (name, description) VALUES
('ROLE_ADMIN', 'Organization Administrator with full controls'),
('ROLE_MANAGER', 'Manager with read/write access and department management permissions'),
('ROLE_EMPLOYEE', 'Standard Employee user with read/write access to own files');
