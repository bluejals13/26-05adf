// api/http.ts

import { authStorage } from "../auth/auth.storage";

export async function request<T>(
  url: string,
  options: RequestInit = {},
  retry = true
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
    credentials: "include",
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw {
      status: res.status,
      data,
    };
  }

  return data;
}
