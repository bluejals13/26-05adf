// k6/auth.js		인증

import http from "k6/http";
import { config } from "../config/env.js";

let tokenCache = null;
let refreshTokenCache = null;
let refreshing = false;

export function login() {
    const res = http.post(
        `${config.baseUrl}/api/auth/login`,
        JSON.stringify({
            username: "admin",
            password: "1234",
        }),
        {
            headers: { "Content-Type": "application/json" },
        }
    );

    const body = res.json();

    tokenCache = body.accessToken;
    refreshTokenCache = body.refreshToken;

    return tokenCache;
}

export function getToken() {
    if (!tokenCache) {
        return login();
    }
    return tokenCache;
}

export function refreshToken() {
    // 🔥 중복 refresh 방지
    if (refreshing) {
        return tokenCache;
    }

    refreshing = true;

    const res = http.post(
        `${config.baseUrl}/api/auth/refresh`,
        JSON.stringify({
            refreshToken: refreshTokenCache,
        }),
        {
            headers: { "Content-Type": "application/json" },
        }
    );

    const body = res.json();

    tokenCache = body.accessToken;
    refreshing = false;

    return tokenCache;
}