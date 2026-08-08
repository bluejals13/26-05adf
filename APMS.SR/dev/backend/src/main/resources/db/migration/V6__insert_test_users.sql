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


INSERT INTO user_roles (user_id, role_id)
SELECT 1, id
FROM roles
WHERE name = 'USER';


INSERT INTO user_roles (user_id, role_id)
SELECT 2, id
FROM roles
WHERE name = 'ADMIN';

