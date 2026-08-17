// mutations/useUserMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userApi } from "../api/user.api";

import { userKeys } from "../queries/useUsers";
import { authKeys } from "../auth/auth.keys";

import type { UserStatus } from "../auth/auth.types";

export function useUserMutations() {
  const qc = useQueryClient();

  const refreshUserData = async () => {
    await Promise.all([
      qc.invalidateQueries({
        queryKey: userKeys.all,
      }),

      qc.invalidateQueries({
        queryKey: authKeys.me(),
      }),
    ]);
  };

  const changeStatus = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: UserStatus;
    }) => userApi.changeStatus(id, status),

    onSuccess: refreshUserData,
  });

  const deleteUser = useMutation({
    mutationFn: (id: number) => userApi.deleteUser(id),

    onSuccess: refreshUserData,
  });

  return {
    changeStatus,
    deleteUser,
  };
}

