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
  const refreshRoleManagement = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      }),

      queryClient.invalidateQueries({
        queryKey: authKeys.me(),
      }),
    ]);
  };

  const saveRole = useMutation({
    mutationFn: (payload: any) =>
      payload.id
        ? updateRole(payload.id, payload)
        : createRole(payload),

    onSuccess: refreshRoleManagement,
  });

  const assignPermissions = useMutation({
    mutationFn: ({ roleId, permissionIds }: any) =>
      assignPermissionsApi(roleId, permissionIds),

    onSuccess: refreshRoleManagement,
  });

  const removeRole = useMutation({
    mutationFn: deleteRole,

    onSuccess: refreshRoleManagement,
  });

  return {
    saveRole,
    assignPermissions,
    removeRole,
  };
};
