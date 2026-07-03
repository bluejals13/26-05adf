// mutations/useRoleManage.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createRole,
  updateRole,
  deleteRole,
  assignPermissions as assignPermissionsApi,
} from "../api/role.api";


export const useRoleManagement = () => {
  const queryClient = useQueryClient();

  const saveRole = useMutation({
    mutationFn: (payload: any) =>
      payload.id
        ? updateRole(payload.id, payload)
        : createRole(payload),

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const assignPermissions = useMutation({
    mutationFn: ({ roleId, permissionIds }: any) =>
      assignPermissionsApi(roleId, permissionIds), // ⭐ alias로 해결

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const removeRole = useMutation({
    mutationFn: deleteRole,

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  return {
    saveRole,
    assignPermissions,
    removeRole,
  };
};

