// mutations/useRoleManage.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createRole,
  updateRole,
  deleteRole,
  assignPermissions as assignPermissionsApi,
} from "../api/role.api";

import { authKeys } from "../auth/auth.keys";

export const useRoleManagement = () => {
  const queryClient = useQueryClient();

  // Role / Permission 변경 후 관련 화면 갱신
  const invalidateRoleRelatedQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      }),

      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      }),
    ]);
  };

  const saveRole = useMutation({
    mutationFn: (payload: any) =>
      payload.id
        ? updateRole(payload.id, payload)
        : createRole(payload),

    onSuccess: invalidateRoleRelatedQueries,
  });

  const assignPermissions = useMutation({
    mutationFn: ({ roleId, permissionIds }: any) =>
      assignPermissionsApi(roleId, permissionIds),

    onSuccess: invalidateRoleRelatedQueries,
  });

  const removeRole = useMutation({
    mutationFn: deleteRole,

    onSuccess: invalidateRoleRelatedQueries,
  });

  return {
    saveRole,
    assignPermissions,
    removeRole,
  };
};
