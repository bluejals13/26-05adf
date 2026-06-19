// bootstrap/bootstrapAuth.tsx				// 리프레시 관리

import { authService } from "../auth/auth.service";
import { queryClient } from "../queryClient";
import { authKeys } from "../auth/auth.keys";
import { useAuthStore } from "../store/auth.store";
import { http } from "../api/http";
import type { User } from "../auth/auth.types";

export async function bootstrapAuth() {
  try {
    const token = await authService.refreshToken();

    if (!token) {
      useAuthStore.getState().setToken(null);
      await queryClient.clear();
      return;
    }

    useAuthStore.getState().setToken(token);

    // 🔥 중요: 기존 stale cache 제거
    await queryClient.removeQueries({ queryKey: authKeys.me });

    await queryClient.prefetchQuery({
      queryKey: authKeys.me,
      queryFn: () => http.get<User>("/api/users/me"),
    });

  } catch {
    useAuthStore.getState().setToken(null);
    await queryClient.clear();
  }
}
