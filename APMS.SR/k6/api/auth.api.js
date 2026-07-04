// k6/api/auth.api.js

import http from "k6/http";
import { config } from "../config/env.js";
import { setToken } from "../core/auth.js";

const BASE_URL = config.baseUrl;

export function login(username, password) {
    const res = http.post(
        `${BASE_URL}/api/auth/login`,
        JSON.stringify({ username, password }),
        {
            headers: { "Content-Type": "application/json" },
        }
    );
    
    if (res.status !== 200) {
        console.error("Login failed:", res.status, res.body);
        return res;
    }

    const data = res.json();

    // 👉 프론트 기준: accessToken 사용
    const token = data.accessToken;

    setToken(token);

    return res;
}
