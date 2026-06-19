import { useAuthStore } from "../store/auth.store";
import { authService } from "../auth/auth.service";

function getAccessToken() {
  return useAuthStore.getState().token;
}

function buildHeaders(token?: string, base?: HeadersInit) {
  const headers = new Headers(base || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

export async function request<T>(
  url: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token = getAccessToken() ?? undefined;

  // 1️⃣ 첫 요청
  let res = await fetch(url, {
    ...options,
    headers: buildHeaders(token, options.headers),
    credentials: "include",
  });

  // 2️⃣ 정상 응답
  if (res.ok) {
    return res.json();
  }

  // 3️⃣ 401 아닌 에러
  if (res.status !== 401) {
    throw await res.json().catch(() => ({
      message: "Request failed",
    }));
  }

  // 4️⃣ refresh 제한
  if (!retry) {
    useAuthStore.getState().logout();
    throw new Error("Unauthorized");
  }

  // 5️⃣ refresh
  const newToken = await authService.refreshToken();

  if (!newToken) {
    useAuthStore.getState().logout();
    throw new Error("Refresh failed");
  }

  useAuthStore.getState().setToken(newToken);

  // 6️⃣ retry 요청 (새 header 필수)
  res = await fetch(url, {
    ...options,
    headers: buildHeaders(newToken, options.headers),
    credentials: "include",
  });

  if (!res.ok) {
    throw await res.json().catch(() => ({
      message: "Request failed",
    }));
  }

  return res.json();
}

export const http = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: unknown) =>
    request<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
};
