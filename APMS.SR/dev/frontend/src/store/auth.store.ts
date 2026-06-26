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
      setToken: (t) => set({ token: t }),
      login: (token) => set({ token, isLoggedOut: false, revoked: false }),
      logout: () => set({ token: null, isLoggedOut: true, revoked: true }),
    }),
    {
      name: STORAGE_KEYS.auth,
    }
  )
);
