// queries/useMe.ts

import { useQuery } from "@tanstack/react-query";
import { http, HttpError } from "../api/http";
import { authKeys } from "../auth/auth.keys";
import type { User } from "../auth/auth.types";
import { useAuthStore } from "../store/auth.store";

export function useMe() {
  const token = useAuthStore((s) => s.token);
  const authServiceUnavailable = useAuthStore(
    (s) => s.authServiceUnavailable,
  );

  return useQuery<User>({
    queryKey: [...authKeys.me(), token],

    queryFn: async () => {
      try {
        return await http.get<User>("/api/users/me");
      } catch (error) {
        // 인증 인프라 장애
        if (
          error instanceof HttpError &&
          error.status === 503
        ) {
          useAuthStore
            .getState()
            .setAuthServiceUnavailable(true);
        }

        throw error;
      }
    },

    enabled: !!token && !authServiceUnavailable,

    retry: 0,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
