// k6/api/menu.api.js

import request from "../core/request.js";

export const MenuAPI = {
    getMenus: () => request("GET", "/api/admin/menus"),

    createMenu: (data) =>
        request("POST", "/api/admin/menus", data),

    deleteMenu: (id) =>
        request("DELETE", `/api/admin/menus/${id}`),
};
