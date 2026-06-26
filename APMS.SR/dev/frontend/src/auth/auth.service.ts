// auth/auth.service.ts						// 인증[ 로그인 , 로그아웃, api 토큰] 관리

import { http } from "../api/http";
import { useAuthStore } from "../store/auth.store";
import { queryClient } from "../queryClient";
//import { authKeys } from "./auth.keys";
// import type { User } from "./auth.types";

export const authService = {    // 로그인 이벤트
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
    type LoginResponse = { accessToken: string; };
    const res = await http.post<LoginResponse>("/api/auth/login", { username, password });

    useAuthStore.getState().setToken(res.accessToken);

    //await queryClient.invalidateQueries({ queryKey: authKeys.me() });
  },

  // 로그아웃
  async logout() {
  try { await http.post( "/api/auth/logout", {} );
    } finally {
      // 1. state 먼저 잠금
      useAuthStore.getState().logout();
      useAuthStore.getState().resetLogoutFlag();
      // 2. query 정리
      await queryClient.cancelQueries();
      queryClient.clear();
      // 3. 이벤트
      window.dispatchEvent(new Event("auth:logout"));
    }
  },
};
