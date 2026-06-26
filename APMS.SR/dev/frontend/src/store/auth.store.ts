// store/auth.store.ts	// 소비자 상태 (Zustand) 관리 	setToken

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../constants/keys";

type AuthState = {
  token: string | null;
  isLoggedOut: boolean;
  setToken: (t: string | null) => void;
  logout: () => void;
  resetLogoutFlag: () => void;
  revoked: boolean;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      revoked: false,
      isLoggedOut: false,
      setToken: (t) => set({ token: t }),
      logout: () => set({ token: null, isLoggedOut: true, revoked: true }),
      resetLogoutFlag: () => set({ isLoggedOut: false }),
    }),
    {
      name: STORAGE_KEYS.auth,
    }
  )
);
