// auth/auth.types.ts						// 각 롤 퍼미션 유저 타입 관리

export const Roles = {
  ADMIN: "ADMIN",
  USER: "USER",
  MODERATOR: "MODERATOR",
} as const;

export type Role =
  typeof Roles[keyof typeof Roles];

export const Permissions = {
  USER_READ: "USER_READ",
  USER_WRITE: "USER_WRITE",
  USER_DELETE: "USER_DELETE",

  ADMIN_ACCESS: "ADMIN_ACCESS",
  SYSTEM_ADMIN: "SYSTEM_ADMIN",
} as const;

export type Permission =
  typeof Permissions[keyof typeof Permissions];

export type User = {
  id: number;
  userId: string;
  username: string;

  roles: Role[];
  permissions: Permission[];
};
