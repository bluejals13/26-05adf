// k6/core/auth.js		인증

import request from "./request.js";

let token = null;

export function login(username, password) {
    const res = request("POST", "/api/auth/login", {
        username,
        password,
    });

    if (res.status !== 200) {
        console.error("Login failed:", res.status, res.body);
        return null;
    }

    const data = res.json();

    token = data.token;
    return token;
}
