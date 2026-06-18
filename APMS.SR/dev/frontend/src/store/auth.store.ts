// store/auth.store.ts	// 소비자 상태 (Zustand) 관리 	setToken

import { create } from "zustand";

type AuthState = {
  token: string | null;

  setToken: (token: string | null) => void;
  logout: () => void;
};

export const useAuthStore =
  create<AuthState>((set) => ({
    token: null,

    setToken: (token) => set({ token }),

    logout: () => set({ token: null }),
  }));