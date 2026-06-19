import { useAuthStore } from "../store/auth.store";
import { authService, isLoggingOut } from "../auth/auth.service";

function getToken() {
  return useAuthStore.getState().token ?? undefined;
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
): Promise<T> {  if (isLoggingOut) { throw new Error("Logging out"); }
  let token = getToken();

  let res = await fetch(url, {
    ...options,
    headers: buildHeaders(token, options.headers),
    credentials: "include",
  });
  
  if (res.ok) {
    return res.json();
  }

  if (res.status !== 401) {
    throw await res.json().catch(() => ({
      message: "Request failed",
    }));
  }

  if (!retry) {
    useAuthStore.getState().logout();
    throw new Error("Unauthorized");
  }

  const newToken = await authService.refreshToken();

  if (!newToken) {
    useAuthStore.getState().logout();
    throw new Error("Refresh failed");
  }

  useAuthStore.getState().setToken(newToken);

  token = newToken;

  res = await fetch(url, {
    ...options,
    headers: buildHeaders(token, options.headers),
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
