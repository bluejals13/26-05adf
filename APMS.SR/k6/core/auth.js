// k6/core/auth.js		인증

import request from "./request.js";

let token = null;

export function login(username, password) {
    const res = request("POST", "/api/auth/login", {
        username,
        password,
    });

    token = res.json().token;
    return token;
}

export function getToken() {
    return token;
}

export function refreshToken() {
    const res = request("POST", "/api/auth/refresh");
    token = res.json().token;
    return token;
}
