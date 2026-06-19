// api/http.ts

import { useAuthStore } from "../store/auth.store";

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

  // 🔥 401 → refresh
  if (res.status === 401 && retry) {
    const newToken = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    })
      .then(r => (r.ok ? r.json() : null))
      .then(d => d?.accessToken);

    if (!newToken) {
      useAuthStore.getState().logout();
      throw new Error("Unauthorized");
    }

    useAuthStore.getState().setToken(newToken);

    return request<T>(url, options, false);
  }

  throw await res.json().catch(() => ({ message: "error" }));
}
