// mutations/useUserMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/user.api";
import { userKeys } from "../queries/useUsers";
import type { UserStatus } from "../auth/auth.types";

export function useUserMutations() {
  const qc = useQueryClient();

  const changeStatus = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: UserStatus;
    }) => userApi.changeStatus(id, status),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: number) => userApi.deleteUser(id),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });
  
  return { changeStatus, deleteUser };
}
