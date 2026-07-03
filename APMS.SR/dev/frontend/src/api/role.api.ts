// api/role.api.ts

import { http } from "../api/http";
import type { Role, CreateRoleRequest } from "../queries/role";

const base = "/api/admin/roles";

// 목록 조회
export const fetchRoles = async (): Promise<Role[]> => {
  const roles = await http.get<Role[]>(base);
  console.log(roles);
  return await http.get<Role[]>(base);
}

// 생성
export const createRole = async (data: CreateRoleRequest): Promise<Role> => {
  return await http.post<Role>(base, data);
};

// 수정
export const updateRole = async (id: number, data: CreateRoleRequest): Promise<Role> => {
  return await http.patch<Role>(`${base}/${id}`, data);
};

// 삭제
export const deleteRole = async (id: number): Promise<void> => {
  return await http.delete(`${base}/${id}`);
};

// 권한 할당
export const assignPermissions = async (roleId: number, permissionIds: number[]): Promise<void> => {
  return await http.post(`${base}/${roleId}/permissions`, {
    permissionIds,
  });
};
