// api/userRole.api.ts

import { http } from "../api/http";

export interface AssignUserRolesRequest {
  roleIds: number[];
}

/**
 * 사용자의 Role을 전체 교체한다.
 *
 * 예:
 * roleIds = [1, 2]
 *
 * 해당 사용자는 위 Role만 가지게 된다.
 *
 * roleIds = []
 * → 모든 Role 해제
 */
export const assignUserRoles = async (
  userId: number,
  roleIds: number[]
): Promise<void> => {
  return await http.post(
    `/api/admin/users/${userId}/roles`,
    {
      roleIds,
    }
  );
};