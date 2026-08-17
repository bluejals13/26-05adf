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

  return useQuery<User>({
    queryKey: [...authKeys.me(), token],

    queryFn: () => http.get<User>("/api/users/me"),

    enabled: !!token,

    retry: 0,

    staleTime: 0,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
