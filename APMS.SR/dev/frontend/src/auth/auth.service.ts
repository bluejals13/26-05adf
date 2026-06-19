// auth/auth.service.ts						// 인증[ 로그인 , 로그아웃, api 토큰] 관리

// import { fetchMe } from "../api/api";
import { http } from "../api/http";
import { useAuthStore } from "../store/auth.store";
import { queryClient } from "../queryClient";
import { authKeys } from "./auth.keys";

import type { User } from "./auth.types";

let refreshPromise: Promise<string | null> | null = null;

export const authService = {
  
  async signup(data: { username: string; email: string; password: string }) {
    await http.post("api/auth/signup", data);
  },
  
  async login(username: string, password: string) {
    const res = await http.post<{ accessToken: string }>(
      "api/auth/login",
      { username, password }
    );

    useAuthStore.getState().setToken(res.accessToken);

    await queryClient.prefetchQuery({
      queryKey: authKeys.me,
      queryFn: () => http.get<User>("api/users/me"),
    });
  },

  async logout() {
    try {
      await http.post("api/auth/logout", {});
    } finally {
      useAuthStore.getState().logout();

      refreshPromise = null;

      await queryClient.removeQueries({
        queryKey: authKeys.me,
      });
    }
  },

  async refreshToken() {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      try {
        const res = await http.post<{ accessToken: string }>(
          "/auth/refresh",
          {}
        );

        useAuthStore.getState().setToken(res.accessToken);

        return res.accessToken;
      } catch {
        useAuthStore.getState().logout();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },
};
