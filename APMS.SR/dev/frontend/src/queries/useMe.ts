// queries/useMe.ts

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { http, HttpError } from "../api/http";
import { authKeys } from "../auth/auth.keys";
import type { User } from "../auth/auth.types";
import { useAuthStore } from "../store/auth.store";

const ME_POLL_INTERVAL = 5000;

export function useMe() {
  const token = useAuthStore((s) => s.token);

  const query = useQuery<User>({
    queryKey: [...authKeys.me(), token],

    queryFn: async () => {
      try {
        const user = await http.get<User>("/api/users/me");

        if (useAuthStore.getState().authServiceUnavailable) {
          useAuthStore
            .getState()
            .setAuthServiceUnavailable(false);
        }

        return user;
      } catch (error) {
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

    enabled: !!token,

    retry: 0,

    staleTime: 0,

    refetchInterval: ME_POLL_INTERVAL,

    refetchOnWindowFocus: true,

    refetchOnReconnect: true,
  });

  useEffect(() => {
    const user = query.data;

    if (!user) {
      return;
    }

    if (user.status === "SUSPENDED") {
      useAuthStore.getState().logout();
    }
  }, [query.data]);

  return query;
}
