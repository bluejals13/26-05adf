// api/menu.api.ts		//메뉴 용 api

// import { fetch } from "../api/api";

export type Menu = {
  id: number;
  name: string;
  price: number;
};

export type MenuRequest = {
  name: string;
  price: number;
};

export const menuApi = {
  getMenus: () => http.get<Menu[]>("/api/admin/menus"),

  createMenu: (data: MenuRequest) =>
    http.post("/api/admin/menus", data),

  deleteMenu: (id: number) =>
    http.post(`/api/admin/menus/${id}`, undefined),
};
