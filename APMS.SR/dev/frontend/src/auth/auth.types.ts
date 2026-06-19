// auth/auth.types.ts						// 각 롤 퍼미션 유저 타입 관리

export const Roles = {
  ADMIN: "ADMIN",
  USER: "USER",
  MANAGER: "MANAGER",
} as const;

export type Role =
  typeof Roles[keyof typeof Roles];

export const Permissions = {
  MENU_READ: "MENU_READ",
  MENU_CREATE: "MENU_CREATE",
  MENU_UPDATE: "MENU_UPDATE",
  MENU_DELETE: "MENU_DELETE",

  USER_READ: "USER_READ",
  USER_CREATE: "USER_CREATE",
  USER_UPDATE: "USER_UPDATE",
  USER_DELETE: "USER_DELETE",

  PERMISSION_READ: "PERMISSION_READ",
} as const;

export const RolePermissions: Record<Role, Permission[]> = {
  ADMIN: [
    "MENU_READ",
    "MENU_CREATE",
    "MENU_UPDATE",
    "MENU_DELETE",
    
    "USER_READ",
    "USER_CREATE",
    "USER_UPDATE",
    "USER_DELETE",
    "PERMISSION_READ",
  ],

  MANAGER: [
    "MENU_READ",
    "MENU_UPDATE",
    "USER_READ",
  ],

  USER: [
    "MENU_READ",
  ],
};

export type Permission =
  typeof Permissions[keyof typeof Permissions];

export type User = {
  id: number;
  userId: string;
  username: string;

  roles: Role[];
  permissions: Permission[];
};
