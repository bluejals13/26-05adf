// hooks/useAuth.ts		// 스토어 > 쿼리 > 훅  :  컴포지션 관리

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const { data: user, isLoading } = useMe();

  return {
    token,
    user: token ? user : null, // 🔥 핵심
    isLoading: !!token && isLoading,
    isLoggedIn: !!token && !!user,
    logout: authService.logout,
  };
}
