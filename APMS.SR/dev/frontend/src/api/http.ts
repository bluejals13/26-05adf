import { useAuthStore } from "../store/auth.store";
import { authService } from "../auth/auth.service";

function getToken() {
  return useAuthStore.getState().token;
}

export async function request<T>(
  url: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token = getToken();

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  // 1. 정상 응답
  if (res.ok) {
    return res.json();
  }

  // 2. 401 아니면 그대로 에러
  if (res.status !== 401) {
    throw await res.json().catch(() => ({ message: "Request failed" }));
  }

  // 3. refresh 실패 방지
  if (!retry) {
    throw new Error("Unauthorized");
  }

  // 4. refresh token으로 재발급
  const newToken = await authService.refreshToken();

  if (!newToken) {
    useAuthStore.getState().logout();
    throw new Error("Refresh failed");
  }

  // 5. store 업데이트 (이거 빠지면 계속 401 남)
  useAuthStore.getState().setToken(newToken);

  // 6. ★ 중요: retry 시 headers 새로 생성
  const retryHeaders = new Headers(options.headers || {});
  retryHeaders.set("Content-Type", "application/json");
  retryHeaders.set("Authorization", `Bearer ${newToken}`);

  const retryRes = await fetch(url, {
    ...options,
    headers: retryHeaders,
    credentials: "include",
  });

  if (!retryRes.ok) {
    throw await retryRes.json().catch(() => ({ message: "Request failed" }));
  }

  return retryRes.json();
}

export const http = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: unknown) =>
    request<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
};
