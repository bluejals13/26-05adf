// k6/api/user.api.js

import request from "../core/request.js";

export const UserAPI = {
    getUsers: (token) =>
        request("GET", "/api/admin/users", 
                token, null, 
                { tags: { api: "getUsers" } } ),

    changeStatus: (token, id, status) =>
        request("PATCH", `/api/admin/users/${id}/status`, 
                token, { status }, 
                { tags: { api: "changeStatus" } } ),

    deleteUser: (token, id) =>
        request("DELETE", `/api/admin/users/${id}`, 
                token, null, 
                { tags: { api: "deleteUser" } } ),
};
