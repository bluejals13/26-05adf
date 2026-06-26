// store/auth.store.ts	// 소비자 상태 (Zustand) 관리 	setToken

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../constants/keys";

type AuthState = {
  token: string | null;
  isLoggedOut: boolean;
  revoked: boolean;
  setToken: (t: string | null) => void;
  logout: () => void;
  login: (token: string) => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      revoked: false,
      isLoggedOut: false,
      setToken: (token) => set({ token }),           // refresh 전용
      login: (token) => set({ token, isLoggedOut: false, revoked: false }),  // 로그인 전용
      logout: () => set({ token: null, isLoggedOut: true, revoked: true }),  // 로그아웃 전용
    }),
    {
      name: STORAGE_KEYS.auth,
    }
  )
);
