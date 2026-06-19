// auth/auth.types.ts						// 각 롤 퍼미션 유저 타입 관리

export type Role = string;
export type Permission = string;

export type User = {
  id: number;
  userId: string;
  username: string;

  roles: Role[];
  permissions: Permission[];
};
