// auth/auth.service.ts						// 인증[ 로그인 , 로그아웃, api 토큰] 관리

import { http } from "../api/http";
import { useAuthStore } from "../store/auth.store";
import { queryClient } from "../queryClient";
import { authKeys } from "./auth.keys";
import type { User } from "./auth.types";

let refreshPromise: Promise<string | null> | null = null;
export let isLoggingOut = false;

export const authService = {
  // 회원가입
  async signup(data: {
    username: string;
    email: string;
    password: string;
  }) {
    await http.post("/api/auth/signup", data);
  },

  // 로그인
  async login(username: string, password: string) {
    const res = await http.post<{ accessToken: string }>(
      "/api/auth/login",
      { username, password }
    );

    // ✅ 단일 source of truth (store만 사용)
    useAuthStore.getState().setToken(res.accessToken);

    // me preload
    await queryClient.prefetchQuery({
      queryKey: authKeys.me,
      queryFn: () => http.get<User>("/api/users/me"),
    });
  },

  // 로그아웃
  async logout() {
    isLoggingOut = true;
  
    try {
      await http.post("/api/auth/logout", {}, false);
    } catch {}
  
    refreshPromise = null;
  
    useAuthStore.getState().logout();
  
    queryClient.clear();
  
    window.dispatchEvent(new Event("auth:logout"));
    await new Promise((r) => setTimeout(r, 0));
    isLoggingOut = false;
  },

  // 토큰 갱신 (refresh)
  async refreshToken() {
    if (isLoggingOut) return null;
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      try { if (isLoggingOut) return null;
        const res = await http.post<{ accessToken: string }>(
          "/api/auth/refresh",
          {}
        );
        if (isLoggingOut) return null;
        // ✅ store만 갱신
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
