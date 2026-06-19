// api/http.ts

import { useAuthStore } from "../store/auth.store";
import { authService } from "../auth/auth.service";

export async function request<T>(
  url: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token = useAuthStore.getState().token;

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // ✅ 정상 응답
  if (res.ok) {
    return res.json();
  }

  // ❌ 401 → refresh 시도
  if (res.status === 401 && retry) {
    const newToken = await authService.refreshToken();

    if (!newToken) {
      authService.logout();
      throw new Error("Unauthorized");
    }

    // store 갱신은 refreshToken 내부에서 이미 처리됨

    return request<T>(url, options, false);
  }

  // ❌ 기타 에러
  const text = await res.text();

  throw new Error(text || "Request failed");
}
