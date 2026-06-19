// bootstrap/bootstrapAuth.tsx				// 리프레시 관리

import { authService } from "../auth/auth.service";
import { queryClient } from "../queryClient";
import { authKeys } from "../auth/auth.keys";
import { useAuthStore } from "../store/auth.store";
import { http } from "../api/http";
import { User } from "../auth/auth.types";

export async function bootstrapAuth() {
  try {
    const token = await authService.refreshToken();

    if (!token) return;
    
    useAuthStore.getState().setToken(token);
    
    await queryClient.prefetchQuery({
      queryKey: authKeys.me,
      queryFn: () => http.get<User>("/users/me"),
    });
  } catch {
    await queryClient.removeQueries({
      queryKey: authKeys.me,
    });
  }
}
