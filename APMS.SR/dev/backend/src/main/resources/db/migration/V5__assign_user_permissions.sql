INSERT INTO role_permissions(role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p
ON p.name IN (
    'USER_READ',
    'MENU_READ'
)
WHERE r.name = 'USER';