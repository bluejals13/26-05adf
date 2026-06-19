// api/user.api.ts			//관리자 페이지 용 api

import { http } from "../api/http";

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
  getUsers: () => http.get<User[]>("/api/admin/users"),

  changeStatus: (id: number, status: UserStatus) =>
    http.post(`/api/admin/users/${id}/status`, { status }),

  deleteUser: (id: number) =>
    http.post(`/api/admin/users/${id}`, undefined),
};
