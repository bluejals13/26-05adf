import { useAuthStore } from "../store/auth.store";
import { authService } from "../auth/auth.service";

export async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  return execute<T>(url, options, true);
}

async function execute<T>(
  url: string,
  options: RequestInit,
  retry: boolean
): Promise<T> {
  const token =
    useAuthStore.getState().token;

  const headers = new Headers(
    options.headers
  );

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status !== 401) {
    if (!res.ok) throw new Error();
    return res.json();
  }

  if (!retry) throw new Error("Unauthorized");

  const newToken =
    await authService.refreshToken();

  if (!newToken) throw new Error("Refresh failed");

  return execute<T>(url, options, false);
}

export const http = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: unknown) =>
    request<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        "Content-Type": "application/json",
      },
    }),
};