// mutations/useUserMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/user.api";
import type { UserStatus } from "../api/user.api"; // ✅ 추가

export const userKeys = {
  all: ["users"] as const,
};

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
      qc.invalidateQueries({ queryKey: ["users"] });
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
