// api/user.api.ts			//관리자 페이지 용 api

import { http } from "../api/http";
import type { User, UserStatus } from "../auth/auth.types";

type ApiResponse<T> = {
  data: T;
};

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    const res = await http.get<ApiResponse<User[]>>("/api/admin/users");

    const list = res.data.data;

    console.log("USER API RESPONSE", res);

    return list.map((u) => ({
      id: u.id,
      username: u.username,
      status: u.status,
      roles: u.roles ?? [],
      permissions: u.permissions ?? [],
    }));
  },

  changeStatus: (id: number, status: UserStatus) =>
    http.post(`/api/admin/users/${id}/status`, { status }),

  deleteUser: (id: number) =>
    http.post(`/api/admin/users/${id}`, {}),
};
