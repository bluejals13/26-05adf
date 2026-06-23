// api/menu.api.ts		//메뉴 용 api

import { http } from "../api/http";
import type { Menu, MenuRequest } from "../auth/auth.types";


export const menuApi = {
  getMenus: () => http.get<Menu[]>("/api/admin/menus"),

  createMenu: (data: MenuRequest) =>
    http.post("/api/admin/menus", data),

  deleteMenu: (id: number) =>
    http.delete(`/api/admin/menus/${id}`, undefined),
};
