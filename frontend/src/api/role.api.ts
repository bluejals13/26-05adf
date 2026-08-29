// src/api/role.api.ts


import { http } from "./http";
import type {
  Role,
  CreateRoleRequest
} from "../types/role";

const base = "/api/admin/roles";

export const fetchRoles = async (): Promise<Role[]> => {
  return await http.get<Role[]>(base);
};

export const createRole = async (
  data: CreateRoleRequest
): Promise<Role> => {
  return await http.post<Role>(base, data);
};

export const updateRole = async (
  id: number,
  data: CreateRoleRequest
): Promise<Role> => {
  return await http.patch<Role>(`${base}/${id}`, data);
};

export const deleteRole = async (
  id: number
): Promise<void> => {
  return await http.delete(`${base}/${id}`);
};

/**
 * Role에 Permission을 전체 할당한다.
 *
 * 전달한 permissionIds만 해당 Role이 가지게 된다.
 */
export const assignPermissions = async (
  roleId: number,
  permissionIds: number[]
): Promise<void> => {
  return await http.post(
    `${base}/${roleId}/permissions`,
    { permissionIds }
  );
};
