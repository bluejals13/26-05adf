// store/auth.store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../constants/keys";

type AuthState = {
  token: string | null;

  // 인증/Redis 인프라 장애 상태
  authServiceUnavailable: boolean;

  setToken: (token: string | null) => void;
  setAuthServiceUnavailable: (value: boolean) => void;

  login: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,

      // 기본값: 정상
      authServiceUnavailable: false,

      // Refresh 성공 시 사용
      setToken: (token) =>
        set({
          token,
          authServiceUnavailable: false,
        }),

      // Redis / 인증 인프라 장애 상태 변경
      setAuthServiceUnavailable: (value) =>
        set({
          authServiceUnavailable: value,
        }),

      // 로그인 성공
      login: (token) =>
        set({
          token,
          authServiceUnavailable: false,
        }),

      // 명시적인 인증 만료 / 로그아웃
      logout: () =>
        set({
          token: null,
          authServiceUnavailable: false,
        }),
    }),
    {
      name: STORAGE_KEYS.auth,
    }
  )
);
