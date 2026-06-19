// api/menu.api.ts		//메뉴 용 api

import { apiFetch } from "../api/api";

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
  getMenus: () => apiFetch<Menu[]>("/api/admin/menus"),

  createMenu: (data: MenuRequest) =>
    apiFetch("/api/admin/menus", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteMenu: (id: number) =>
    apiFetch(`/api/admin/menus/${id}`, {
      method: "DELETE",
    }),
};