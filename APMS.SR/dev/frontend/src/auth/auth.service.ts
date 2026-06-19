// auth/auth.service.ts						// 인증[ 로그인 , 로그아웃, api 토큰] 관리

// auth/auth.service.ts

import { http } from "../api";
import { useAuthStore } from "../store/auth.store";
import { queryClient } from "../queryClient";
import { authKeys } from "./auth.keys";
import type { User } from "./auth.types";

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

    useAuthStore.getState().setToken(res.accessToken);

    await queryClient.prefetchQuery({
      queryKey: authKeys.me,
      queryFn: () => http.get<User>("/api/users/me"),
    });
  },

  // 로그아웃
  async logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    useAuthStore.getState().logout();
    queryClient.clear();

    window.dispatchEvent(new Event("auth:logout"));
  },
};
