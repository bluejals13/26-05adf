// api/role.api.ts

import { http } from "../api/http";

const base = "/api/admin/roles";

// 목록 조회
export const fetchRoles = async (): Promise<Role[]> => {
    const list = await http.get<Role[]>(base);
    return list;
}

// 생성
export const createRole = async (data: any) => {
  const list = await http.post(base, data);
  return list;
};

// 수정
export const updateRole = async (id: number, data: any) => {
  const list = await http.patch(`${base}/${id}`, data);
  return list;
};

// 삭제
export const deleteRole = async (id: number) => {
  const list = await http.delete(`${base}/${id}`);
  return list;
};

// 권한 할당
export const assignPermissions = async (roleId: number, permissionIds: number[]) => {
  const list = await http.post(`${base}/${roleId}/permissions`, {
    permissionIds,
  });
  return list;
};
