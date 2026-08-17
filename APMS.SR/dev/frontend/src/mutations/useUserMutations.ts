// mutations/useUserMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userApi } from "../api/user.api";
import { userKeys } from "../queries/useUsers";
import type { UserStatus } from "../auth/auth.types";
import { authKeys } from "../auth/auth.keys";

export function useUserMutations() {
  const qc = useQueryClient();

  const invalidateUserQueries = async () => {
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

    onSuccess: invalidateUserQueries,
  });

  const deleteUser = useMutation({
    mutationFn: (id: number) =>
      userApi.deleteUser(id),

    onSuccess: invalidateUserQueries,
  });

  return {
    changeStatus,
    deleteUser,
  };
}
