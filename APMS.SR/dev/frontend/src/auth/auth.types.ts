// auth/auth.types.ts						// 각 롤 퍼미션 유저 타입 관리

export type Role = "ADMIN" | "USER" | string;
export type Permission = string;

export type UserStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "DELETE_PENDING"
  | "DELETED";

export interface User {
  id: number;
  username: string;
  status: UserStatus;
  roles: Role[];
  permissions: Permission[];
}
