// k6/request.js		통신규격

import http from "k6/http";
import { config } from "../config/env.js";
import { getToken, refreshToken } from "./auth.js";

const BASE_URL = config.baseUrl;

export function request(method, path, body, options = {}) {
    let token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const payload = body ? JSON.stringify(body) : null;

    let res = http.request(method, `${BASE_URL}${path}`, payload, {
        ...options,
        headers,
    });

    if (res.status === 401 && token) {
        token = refreshToken();
        headers.Authorization = `Bearer ${token}`;

        res = http.request(method, `${BASE_URL}${path}`, payload, {
            ...options,
            headers,
        });
    }

    return res;
}