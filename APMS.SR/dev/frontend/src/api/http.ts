// api/http.ts

import { useAuthStore } from "../store/auth.store";

type TokenResponse = {
  accessToken: string;
};
//  isLoggedOut: false;
//  revoked: false;

let refreshPromise: Promise<TokenResponse | null> | null = null;

export async function refreshToken(): Promise<TokenResponse | null> {
  if (refreshPromise) return refreshPromise;
  if (useAuthStore.getState().revoked) return null;   // 🔥 핵심 가드

  refreshPromise = (async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) return null;

      const data: TokenResponse = await res.json();

      if (!data?.accessToken) return null;

      console.log("🔥 refresh called");

      return data;
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
): Promise<T> {  console.log("REQUEST CALLED");
  const token = useAuthStore.getState().token;

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { 
      Authorization: `Bearer ${token}` 
      } : {}),
      ...(options.headers || {}),
    }
  });

  // 🔥 401 handling
  if (res.status === 401 && retry && !useAuthStore.getState().revoked)) {
    const newToken = await refreshToken();

    //if (isAuthEndpoint) { throw new Error("Unauthorized"); 
    if (!newToken?.accessToken) {
      useAuthStore.getState().logout();
      //queryClient.clear(); // 중요
      throw new Error("Unauthorized");
    }
    console.log("🔁 retry request", url);
    // 🔥 중요: refresh 후 token 재주입
    useAuthStore.getState().setToken(newToken.accessToken);

    return request<T>(url, {
      ...options, 
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken.accessToken}`,
      },
    }, false);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json();
}

export const http = {
  get: <T>(url: string) =>
    request<T>(url, { method: "GET" }),

  post: <T>(url: string, body?: unknown, options?: RequestInit) => {
    console.log("POST METHOD", url)
    return request<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined, ...options,
    });},
  
  patch: <T>(url: string, body?: unknown) => {
  console.log("PATCH METHOD", url)
  return request<T>(url, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });},
  
  put: <T>(url: string, body?: unknown) =>
    request<T>(url, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(url: string) =>
    request<T>(url, { method: "DELETE" }),
};

