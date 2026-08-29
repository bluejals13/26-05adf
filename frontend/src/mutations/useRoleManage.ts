// mutations/useRoleManage.ts

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createRole,
  updateRole,
  deleteRole,
  assignPermissions as assignPermissionsApi,
} from "../api/role.api";

import type {
  CreateRoleRequest,
  UpdateRoleRequest,
} from "../types/role";

import { userKeys } from "../queries/useUsers";

type SaveRolePayload =
  | CreateRoleRequest
  | (UpdateRoleRequest & {
      id: number;
    });

type AssignPermissionsPayload = {
  roleId: number;
  permissionIds: number[];
};

export const useRoleManagement = () => {
  const queryClient = useQueryClient();

  const invalidateRoles = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["roles"],
    });
  };

  const invalidateUsers = async () => {
    await queryClient.invalidateQueries({
      queryKey: userKeys.all,
    });
  };

  // Role 생성 / 수정
  const saveRole = useMutation({
    mutationFn: (
      payload: SaveRolePayload
    ) => {
      if ("id" in payload) {
        const { id, ...data } = payload;

        return updateRole(id, data);
      }

      return createRole(payload);
    },

    onSuccess: invalidateRoles,
  });

  // Role ↔ Permission 관계 변경
  const assignPermissions = useMutation({
    mutationFn: ({
      roleId,
      permissionIds,
    }: AssignPermissionsPayload) =>
      assignPermissionsApi(
        roleId,
        permissionIds
      ),

    onSuccess: async () => {
      await Promise.all([
        invalidateRoles(),
        invalidateUsers(),
      ]);
    },
  });

  // Role 삭제
  const removeRole = useMutation({
    mutationFn: (roleId: number) =>
      deleteRole(roleId),

    onSuccess: invalidateRoles,
  });

  return {
    saveRole,
    assignPermissions,
    removeRole,
  };
};