// k6/core/request.js		통신규격

import http from "k6/http";
import { config } from "../config/env.js";
import { getToken } from "./auth.js";

const BASE_URL = config.baseUrl;

export default function request(method, path, body = null, options = {}) {
    const token = getToken();

    const payload = body ? JSON.stringify(body) : null;

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    return http.request(method, `${BASE_URL}${path}`, payload, {
        ...options,
        headers,
    });
}
