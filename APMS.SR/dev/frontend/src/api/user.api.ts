// api/user.api.ts			//관리자 페이지 용 api

import { http } from "../api/http";
import type { User, UserStatus } from "../auth/auth.types";

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    const data = await http.get<any[]>("/api/admin/users");
  
    return data.map((u) => ({
      ...u,
      roles: u.roles ?? [],
      permissions: u.permissions ?? [],
    }));
  };

  changeStatus: (id: number, status: UserStatus) =>
    http.post(`/api/admin/users/${id}/status`, { status }),

  deleteUser: (id: number) =>
    http.post(`/api/admin/users/${id}`, undefined),
};
