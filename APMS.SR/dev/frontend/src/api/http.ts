// api/http.ts

import { useAuthStore } from "../store/auth.store";

let refreshPromise: Promise<string | null> | null = null;

async function refreshToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) return null;

      const data = await res.json();

      const token = data?.accessToken ?? null;

      if (token) {
        useAuthStore.getState().setToken(token);
      }

      return token;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

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

  if (res.ok) return res.json();

  // 🔥 401 → refresh (여기서만 처리)
  if (res.status === 401 && retry) {
    const newToken = await refreshToken();

    if (!newToken) {
      useAuthStore.getState().logout();
      throw new Error("Unauthorized");
    }

    return request<T>(url, options, false);
  }

  const text = await res.text();
  throw new Error(text || "Request failed");
}
