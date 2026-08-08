INSERT INTO roles (id, name, description, level, is_system)
VALUES
(1, 'ADMIN', 'Administrator', 10, false),
(2, 'USER', 'Normal User', 10, false);

INSERT INTO permissions (id, name, description)
VALUES
(1, 'USER_READ', NULL),
(2, 'USER_CREATE', NULL),
(3, 'USER_UPDATE', NULL),
(4, 'USER_STATUS_UPDATE', NULL),
(5, 'USER_DELETE', NULL),
(6, 'ROLE_READ', NULL),
(7, 'ROLE_CREATE', NULL),
(8, 'ROLE_UPDATE', NULL),
(9, 'ROLE_DELETE', NULL),
(10, 'ROLE_ASSIGN', NULL),
(11, 'ROLE_REMOVE', NULL),
(12, 'MENU_READ', NULL),
(13, 'MENU_CREATE', NULL),
(14, 'MENU_UPDATE', NULL),
(15, 'MENU_DELETE', NULL),
(16, 'PERMISSION_READ', NULL),
(17, 'PERMISSION_CREATE', NULL),
(18, 'PERMISSION_UPDATE', NULL),
(19, 'PERMISSION_DELETE', NULL);

INSERT INTO users (
    id,
    username,
    password,
    status,
    email
)
VALUES
(
    1,
    'testuser',
    '$2a$10$eFZu4rKvdovHaBfx0w91Pe8bxWl.GNOQA5i2NP2rgHq1.ydzGY2je',
    'ACTIVE',
    'testuser@test.com'
),
(
    2,
    'admin',
    '$2a$10$mLxWbOKAz6/EAO14u.SQB.vtZTwQBt3kQb0qeGMdwm2nnvoX8Pwji',
    'ACTIVE',
    'admin@test.com'
);

INSERT INTO user_roles (user_id, role_id)
VALUES
(1, 2),
(2, 1);