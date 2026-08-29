// types/role.ts

export type RolePermission = {
  id: number;
  name: string;
};

export type Role = {
  id: number;
  name: string;
  description: string;
  permissions: RolePermission[];
};

export type CreateRoleRequest = {
  name: string;
  description: string;
};

export type UpdateRoleRequest = {
  name: string;
  description: string;
};