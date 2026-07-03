// api/role.api.ts

import { http } from "../api/http";
import type { Role } from "../queries/role";

const base = "/api/admin/roles";

// 목록 조회
export const fetchRoles = async (): Promise<Role[]> => {
    const res = await http.get(base);
    return res.data;
}

// 생성
export const createRole = async (data: any): Promise<Role> => {
  const res = await http.post(base, data);
  return res.data;
};

// 수정
export const updateRole = async (id: number, data: CreateRoleRequest): Promise<Role> => {
  const res = await http.patch(`${base}/${id}`, data);
  return res.data;
};

// 삭제
export const deleteRole = async (id: number): Promise<void> => {
  const res = await http.delete(`${base}/${id}`);
  return res.data;
};

// 권한 할당
export const assignPermissions = async (roleId: number, permissionIds: number[]): Promise<void> => {
  const res = await http.post(`${base}/${roleId}/permissions`, {
    permissionIds,
  });
  return res.data;
};
