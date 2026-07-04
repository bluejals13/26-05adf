// k6/api/auth.api.js

import http from "k6/http";
import { config } from "../config/env.js";

const BASE_URL = config.baseUrl;

export function login(username, password) {
    return request("POST", "/api/auth/login");
}

export function refresh(refreshToken) {
    return http.post(
        `${BASE_URL}/api/auth/refresh`,
        JSON.stringify({ refreshToken }),
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}

export function logout(token) {
    return http.post(
        `${BASE_URL}/api/auth/logout`,
        null,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}
