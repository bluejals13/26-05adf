// store/auth.store.ts	// 소비자 상태 (Zustand) 관리 	setToken

import { create } from "zustand";
import { authStorage } from "../auth/auth/auth.storage";

type AuthState = {
  token: string | null;
  isGuest: boolean;

  setToken: (token: string | null) => void;
  setGuest: () => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isGuest: false,

  setToken: (token) => {
    if (token) authStorage.set(token);
    else authStorage.clear();

    set({
      token,
      isGuest: false, // 🔥 로그인하면 guest 해제
    });
  },

  setGuest: () => {
    authStorage.clear(); // 🔥 토큰 제거
    set({
      token: null,
      isGuest: true,
    });
  },

  logout: () => {
    authStorage.clear();
    set({
      token: null,
      isGuest: false,
    });
  },

  hydrate: () => {
    const token = authStorage.get();

    set({
      token,
      isGuest: !token, // 🔥 토큰 없으면 guest
    });
  },
}));
