// store/auth.store.ts	// 소비자 상태 (Zustand) 관리 	setToken

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../constants/keys";

type AuthState = {
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      setToken: (t) => set({ token: t }),
      logout: () => set({ token: null }),
    }),
    {
      name: STORAGE_KEYS.auth,
      onRehydrateStorage: () => (state) => {
        state._hydrated = true;
    }
  )
);
