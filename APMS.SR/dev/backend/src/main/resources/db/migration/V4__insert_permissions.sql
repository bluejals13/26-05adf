INSERT INTO permissions(name)
VALUES
('USER_READ'),
('USER_STATUS_UPDATE'),
('USER_DELETE'),

('ROLE_READ'),
('ROLE_CREATE'),
('ROLE_UPDATE'),
('ROLE_DELETE'),

('ROLE_ASSIGN'),

('MENU_READ'),
('MENU_CREATE'),
('MENU_UPDATE'),
('MENU_DELETE'),

('PERMISSION_READ');


INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ADMIN';


INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p
ON p.name IN (
    'USER_READ',
    'MENU_READ'
)
WHERE r.name = 'USER';
