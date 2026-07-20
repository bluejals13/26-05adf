CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(255),
    username VARCHAR(255) UNIQUE,
    password_changed_at DATETIME(6),
    status ENUM(
        'ACTIVE',
        'DELETED',
        'DELETE_PENDING',
        'SUSPENDED'
    ) NOT NULL DEFAULT 'ACTIVE',
    email VARCHAR(255)
);


CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255),
    level INT NOT NULL DEFAULT 10,
    is_system BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255),
    name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,

    PRIMARY KEY(user_id, role_id),

    CONSTRAINT fk_user_roles_user
        FOREIGN KEY(user_id)
        REFERENCES users(id),

    CONSTRAINT fk_user_roles_role
        FOREIGN KEY(role_id)
        REFERENCES roles(id)
);


CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,

    PRIMARY KEY(role_id, permission_id),

    CONSTRAINT fk_role_permissions_role
        FOREIGN KEY(role_id)
        REFERENCES roles(id),

    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY(permission_id)
        REFERENCES permissions(id)
);


CREATE TABLE menu (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    price INT NOT NULL
);


CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100),
    created_at DATETIME(6),
    result VARCHAR(255),
    target_id BIGINT,
    target_type VARCHAR(255),
    user_id BIGINT,
    after_value VARCHAR(255),
    before_value VARCHAR(255)
);