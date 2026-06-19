// queries/useUsers.ts			// 관리자 페이지 용 쿼리

import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user.api";

import { useAuth } from "../auth/hooks/useAuth";

export function useUsers() {
  const { user, isLoading } = useAuth();

  return useQuery({
    queryKey: ["users"],
    queryFn: userApi.getUsers,
    enabled: !!user && !isLoading,
  });
}
