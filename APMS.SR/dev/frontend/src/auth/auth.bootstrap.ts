// bootstrap/bootstrapAuth.tsx				// 리프레시 관리

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapAuth() {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    try {
      const token = await authService.refreshToken();

      if (!token) {
        useAuthStore.getState().setToken(null);
        await queryClient.clear();
        return;
      }

      useAuthStore.getState().setToken(token);

      await queryClient.removeQueries({
        queryKey: authKeys.me,
      });

      await queryClient.prefetchQuery({
        queryKey: authKeys.me,
        queryFn: () => http.get<User>("/api/users/me"),
      });
    } catch {
      useAuthStore.getState().setToken(null);
      await queryClient.clear();
    }
  })();

  return bootstrapPromise;
}
