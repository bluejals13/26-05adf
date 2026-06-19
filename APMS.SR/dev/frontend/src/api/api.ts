// api.ts HTTP만

import { authStorage } from "../auth/auth.storage";	// jwt 토큰 키 get, set, clear
import { http } from "../api/http";

export const http = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: unknown, retry = true) =>
    request<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }, retry),
};

export const fetchMe = () => http.get("/users/me");

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = authStorage.get();

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // body 없을 수도 있음 (204 대응)
  const text = await res.text();
  
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw {
      status: res.status,
      data,
    };
  }

  return data;
}
