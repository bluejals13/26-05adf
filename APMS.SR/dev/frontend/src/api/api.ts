// api.ts HTTP만

import { request } from "./http";

export const http = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, body?: unknown, retry = true) =>
    request<T>(
      url,
      {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      },
      retry
    ),
};

export const fetchMe = () => http.get("api/users/me");
