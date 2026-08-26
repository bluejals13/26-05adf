// queries/useUsers.ts			// 관리자 페이지 용 쿼리

import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user.api";

export const userKeys = {
  all: ["users"] as const,
};

export function useUsers(options?: {
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: userApi.getUsers,

    enabled: options?.enabled ?? true,

    retry: 1,

    staleTime: 1000 * 10,
    refetchOnWindowFocus: true,
  });
}
