// src/api/permission.api.ts

import { http } from "./http";

export type Permission = {
  id: number;
  name: string;
  description: string | null;
};

export type PermissionDetail = {
  id: number;
  name: string;
  description: string | null;
  roles: {
    id: number;
    name: string;
  }[];
};

export const getPermissions = () => {
  return http.get<Permission[]>("/api/admin/permissions");
};

export const getPermission = (id: number) => {
  return http.get<PermissionDetail>(
    `/api/admin/permissions/${id}`
  );
};
