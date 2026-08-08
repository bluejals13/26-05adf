-- V5__insert_user_permissions_and_test_users.sql

-- =========================================================
-- USER Role에 기본 Permission 할당
-- =========================================================

INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p
    ON p.name IN (
        'USER_READ',
        'MENU_READ'
    )
WHERE r.name = 'USER';


-- =========================================================
-- 테스트 사용자 생성
-- =========================================================

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
    '$2a$10$...',
    'ACTIVE',
    'testuser@test.com'
),
(
    2,
    'admin',
    '$2a$10$...',
    'ACTIVE',
    'admin@test.com'
);


-- =========================================================
-- testuser → USER Role
-- =========================================================

INSERT INTO user_roles (user_id, role_id)
SELECT 1, id
FROM roles
WHERE name = 'USER';


-- =========================================================
-- admin → ADMIN Role
-- =========================================================

INSERT INTO user_roles (user_id, role_id)
SELECT 2, id
FROM roles
WHERE name = 'ADMIN';
