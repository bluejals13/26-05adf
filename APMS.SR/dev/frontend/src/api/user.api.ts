// api/user.api.ts			//관리자 페이지 용 api

import { http } from "../api/http";
import type { User, UserStatus } from "../auth/auth.types";


export const userApi = {
  getUsers: async (): Promise<User[]> => {
    
    const list = await http.get<User[]>("/api/admin/users");
    
    
    console.log("USER API RESPONSE", list);

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
