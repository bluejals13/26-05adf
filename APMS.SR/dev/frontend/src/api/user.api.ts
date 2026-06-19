// api/user.api.ts			//관리자 페이지 용 api

import { apiFetch } from "../api/api";

export type UserStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "DELETE_PENDING"
  | "DELETED";

export type User = {
  id: number;
  username: string;
  permissions: string[];
  status: UserStatus;
};

export const userApi = {
  getUsers: () => apiFetch<User[]>("/api/admin/users"),

  changeStatus: (id: number, status: UserStatus) =>
    apiFetch(`/api/admin/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  deleteUser: (id: number) =>
    apiFetch(`/api/admin/users/${id}`, {
      method: "DELETE",
    }),
};
