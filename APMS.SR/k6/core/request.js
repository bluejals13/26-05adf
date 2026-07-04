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

export function request(method, path, body, options = {}) {
    let token = getToken();

    let payload = null;

    // GET 요청이면 body 보내지 않도록
    if (body !== undefined && body !== null) {
        payload = JSON.stringify(body);
    }

    let headers = buildHeaders(options.headers, token);

    let res = http.request(
        method,
        `${BASE_URL}${path}`,
        payload,
        {
            ...options,
            headers,
        }
    );

    // =========================
    // 401 재시도 (최소 안전 버전)
    // =========================
    if (res.status === 401 && token) {
        token = refreshToken();

        headers = buildHeaders(options.headers, token);

        res = http.request(
            method,
            `${BASE_URL}${path}`,
            payload,
            {
                ...options,
                headers,
            }
        );
    }

    return res;
}
