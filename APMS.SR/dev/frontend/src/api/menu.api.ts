// api/menu.api.ts		//메뉴 용 api

import { http } from "../api/http";
import type { Menu, MenuRequest } from "../auth/auth.types";

export const menuApi = {
  getMenus: async (): Promise<Menu[]> => {
    const list = await http.get<Menu[]>("/api/admin/menus");
    return list;
  },

  createMenu: (data: MenuRequest) =>
    http.post("/api/admin/menus", data),

  deleteMenu: (id: number) =>
    http.delete(`/api/admin/menus/${id}`),
};
