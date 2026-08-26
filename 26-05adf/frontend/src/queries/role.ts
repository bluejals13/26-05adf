// queries/role.ts

export type Role = {
  id: number;
  name: string;
  description: string;
};

export type CreateRoleRequest = {
  name: string;
  description: string;
};
