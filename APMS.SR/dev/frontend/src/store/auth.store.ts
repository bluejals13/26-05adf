// store/auth.store.ts	// 소비자 상태 (Zustand) 관리 	setToken

import { create } from "zustand";
import { authStorage } from "../auth/auth.storage";

type AuthState = {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,

  setToken: (token) => {
    if (token) authStorage.set(token);
    else authStorage.clear();

    set({ token });
  },

    logout: () => {
      authStorage.clear();
      set({ token: null });
    },

  hydrate: () => {
    const token = authStorage.get();
    set({ token });
  },
}));
