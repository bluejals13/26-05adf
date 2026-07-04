// k6/api/user.api.js

import request from "../core/request.js";

export const UserAPI = {
    getUsers: () =>
        request("GET", "/api/admin/users", null, {
            tags: { api: "getUsers" },
        }),

    changeStatus: (id, status) =>
        request("PATCH", `/api/admin/users/${id}/status`, { status }),

    deleteUser: (id) =>
        request("DELETE", `/api/admin/users/${id}`),
};
