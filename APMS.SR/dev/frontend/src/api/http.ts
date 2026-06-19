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

  // ✅ 핵심: null 대신 T 타입 맞추기
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text) as T;
}
