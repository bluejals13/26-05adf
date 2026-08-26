// api/menu.api.ts		//메뉴 용 api

import { http } from "../api/http";
import type { Menu, MenuRequest } from "../auth/auth.types";

export const menuApi = {
  getMenus: async (): Promise<Menu[]> => {        // 목록 조회
    const list = await http.get<Menu[]>("/api/admin/menus");
    return list;
  },
  
  // 단일 메뉴 조회 (수정 페이지용)
  getMenu: async (id: number): Promise<Menu> => {
    const menu = await http.get<Menu>( `/api/admin/menus/${id}` );
    return menu;
  },
  
  createMenu: (data: MenuRequest) =>
    http.post("/api/admin/menus", data),
  
  updateMenu: (id: number, data: MenuRequest) =>
    http.patch(`/api/admin/menus/${id}`, data),

  deleteMenu: (id: number) =>
    http.delete(`/api/admin/menus/${id}`),
};
