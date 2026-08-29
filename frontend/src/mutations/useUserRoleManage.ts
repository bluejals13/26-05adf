// mutations/useUserRoleManage.ts

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { assignUserRoles } from "../api/userRole.api";

type AssignUserRolesPayload = {
  userId: number;
  roleIds: number[];
};

export const useUserRoleManage = () => {
  const queryClient = useQueryClient();

  const assignRoles = useMutation({
    mutationFn: ({
      userId,
      roleIds,
    }: AssignUserRolesPayload) =>
      assignUserRoles(userId, roleIds),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["userRoles"],
      });
    },
  });

  return {
    assignRoles,
  };
};