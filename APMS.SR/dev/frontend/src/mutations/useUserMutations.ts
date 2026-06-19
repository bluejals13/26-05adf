// mutations/useUserMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/user.api";

export const userKeys = {
  all: ["users"] as const,
};

export function useUserMutations() {
  const qc = useQueryClient();

  const changeStatus = useMutation({
    mutationFn: userApi.changeStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });

  const deleteUser = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });

  return { changeStatus, deleteUser };
}
