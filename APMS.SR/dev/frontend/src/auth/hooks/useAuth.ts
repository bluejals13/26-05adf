// hooks/useAuth.ts		// 스토어 > 쿼리 > 훅  :  컴포지션 관리

import { useMe } from "../../queries/useMe";
import { useAuthStore } from "../../store/auth.store";
import { authService } from "../auth.service";

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const { data: user, isLoading } = useMe();

  return {
    token,
    user,
    isLoading,
    isLoggedIn: !!token && !!user && !isLoading,
    logout: authService.logout,
  };
}
