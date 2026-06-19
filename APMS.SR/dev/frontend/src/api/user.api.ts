// api/user.api.ts			//관리자 페이지 용 api

import { apiFetch } from "../api/api";
import type { User } from "../auth/auth.types";

export const userApi = {
  getUsers: () => apiFetch<User[]>("/api/admin/users"),

  changeStatus: (id: number, status: string) =>
    apiFetch(`/api/admin/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  deleteUser: (id: number) =>
    apiFetch(`/api/admin/users/${id}`, {
      method: "DELETE",
    }),
};


