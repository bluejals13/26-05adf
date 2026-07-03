// api/role.api.ts

import { http } from "../api/http";
import type { Role } from "../queries/role";

const base = "/api/admin/roles";

// 목록 조회
export const fetchRoles = async (): Promise<Role[]> => {
    const { data } = await http.get(base);
    return data;
}

// 생성
export const createRole = async (data: any): Promise<Role> => {
  const { data } = await http.post(base, data);
  return data;
};

// 수정
export const updateRole = async (id: number, data: CreateRoleRequest): Promise<Role> => {
  const { data } = await http.patch(`${base}/${id}`, data);
  return data;
};

// 삭제
export const deleteRole = async (id: number): Promise<void> => {
  const { data } = await http.delete(`${base}/${id}`);
  return data;
};

// 권한 할당
export const assignPermissions = async (roleId: number, permissionIds: number[]): Promise<void> => {
  const { data } = await http.post(`${base}/${roleId}/permissions`, {
    permissionIds,
  });
  return data;
};
