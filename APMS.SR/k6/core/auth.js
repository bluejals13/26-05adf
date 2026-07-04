// k6/core/auth.js		인증

import { request } from "./core/request.js";

export function login(username, password) {
    return request("POST", "/api/auth/login", {
        username,
        password,
    });
}
