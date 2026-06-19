// api/http.ts

import { authStorage } from "../auth/auth.storage";

export async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
