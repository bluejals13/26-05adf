// hooks/useAuth.ts		// 스토어 > 쿼리 > 훅  :  컴포지션 관리

import { useMe } from "../queries/useMe";
import { useAuthStore } from "../store/auth.store";
import { authService } from "../auth/auth.service";

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const { data: user, isLoading } = useMe();

  const logout = async () => {
    await authService.logout();
  };

  return {
    token,
    user,
    logout,
    isLoading,
    isLoggedIn: !!token && !!user && !isLoading,
  };
}