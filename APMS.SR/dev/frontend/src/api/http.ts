// api/http.ts

import { useAuthStore } from "../store/auth.store";

type TokenResponse = {
  accessToken: string;
};

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export class RefreshTokenError extends HttpError {
  constructor(
    status: number,
    message = "Refresh token request failed",
  ) {
    super(status, message);
    this.name = "RefreshTokenError";
  }
}

// 동시에 여러 요청에서 refresh가 발생하는 것을 방지
let refreshPromise: Promise<TokenResponse | null> | null = null;

// Refresh 요청 최대 대기 시간
const REFRESH_TIMEOUT = 5000;

export async function refreshToken(): Promise<TokenResponse | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, REFRESH_TIMEOUT);

    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new RefreshTokenError(
          res.status,
          "Refresh token request failed",
        );
      }

      const data: TokenResponse = await res.json();

      return data?.accessToken ? data : null;

    } catch (error) {

      // Redis 장애 등으로 Refresh 응답이
      // 일정 시간 내 도착하지 않는 경우
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        throw new RefreshTokenError(
          503,
          "Authentication service timeout",
        );
      }

      throw error;

    } finally {
      window.clearTimeout(timeoutId);
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function request<T>(
  url: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = useAuthStore.getState().token;

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  // 401 → Refresh Token으로 한 번만 재인증
  if (res.status === 401 && retry) {
    const newToken = await refreshToken();

    if (!newToken?.accessToken) {
      throw new RefreshTokenError(
        401,
        "Unauthorized",
      );
    }

    // 새 Access Token 저장
    useAuthStore.getState().login(newToken.accessToken);

    // 새 Token으로 동일 요청 1회 재시도
    return request<T>(
      url,
      {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken.accessToken}`,
        },
      },
      false,
    );
  }

  if (!res.ok) {
    const text = await res.text();

    throw new HttpError(
      res.status,
      text || "Request failed",
    );
  }

  return res.json();
}

export const http = {
  get: <T>(url: string): Promise<T> =>
    request<T>(url, {
      method: "GET",
    }),

  post: <T>(
    url: string,
    body?: unknown,
    options?: RequestInit,
  ): Promise<T> =>
    request<T>(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  patch: <T>(
    url: string,
    body?: unknown,
  ): Promise<T> =>
    request<T>(url, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(
    url: string,
    body?: unknown,
  ): Promise<T> =>
    request<T>(url, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(url: string): Promise<T> =>
    request<T>(url, {
      method: "DELETE",
    }),
};
