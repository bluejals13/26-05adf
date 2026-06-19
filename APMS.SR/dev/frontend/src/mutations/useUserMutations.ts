// mutations/useUserMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, UserStatus } from "../api/user.api";

export function useUserMutations() {
  const qc = useQueryClient();

  const changeStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: UserStatus }) =>
      userApi.changeStatus(id, status),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: number) => userApi.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { changeStatus, deleteUser };
}
