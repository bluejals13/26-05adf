// k6/core/request.js		통신규격

import http from "k6/http";
import { config } from "../config/env.js";

const BASE_URL = config.baseUrl;

function buildHeaders(extraHeaders = {}, token) {
    return {
        "Content-Type": "application/json",
        ...extraHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export default function request(method, path, body = null, options = {}) {
    const payload = body == null ? null : JSON.stringify(body);

    const res = http.request(method, `${BASE_URL}${path}`, payload, {
        ...options,
        headers: buildHeaders(options.headers),
    });

    return res;
}
