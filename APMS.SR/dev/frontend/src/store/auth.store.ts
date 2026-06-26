// store/auth.store.ts	// 소비자 상태 (Zustand) 관리 	setToken

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../constants/keys";

type AuthState = {
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
  login: (token: string) => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),           // refresh 전용
      login: (token) => set({ token }),  // 로그인 전용
      logout: () => set({ token: null }),  // 로그아웃 전용
    }),
    {
      name: STORAGE_KEYS.auth,
    }
  )
);
