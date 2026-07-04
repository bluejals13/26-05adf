// k6/request.js		통신규격

import http from "k6/http";
import { config } from "../config/env.js";
import { getToken, refreshToken } from "./auth.js";

const BASE_URL = config.baseUrl;

function buildHeaders(extraHeaders = {}, token) {
    const headers = {
        "Content-Type": "application/json",
        ...extraHeaders,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

export default function request(method, path, body = null, options = {}) {
    let retry = 0;

    let token = getToken();

    const payload =
        body === null || body === undefined
            ? null
            : JSON.stringify(body);

    let headers = buildHeaders(options.headers, token);

    let res = http.request(method, `${BASE_URL}${path}`, payload, {
            ...options,
            headers,
        }
    );

    // =========================
    // 401 retry (1회 제한)
    // =========================
    if (res.status === 401 && retry < 1) {
        retry++;

        token = refreshToken();

        headers = buildHeaders(options.headers, token);

        res = http.request(method, `${BASE_URL}${path}`, payload, {
                ...options,
                headers,
            }
        );
    }

    // =========================
    // 5xx 처리 (기본 형태)
    // =========================
    if (res.status >= 500) {
        console.error(`Server error: ${res.status} ${method} ${path}`);
    }

    return res;
}

