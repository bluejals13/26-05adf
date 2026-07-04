// k6/core/request.js		통신규격

import http from "k6/http";
import { config } from "../config/env.js";
import { getToken } from "./auth.js";

const BASE_URL = config.baseUrl;

function buildHeaders(extraHeaders = {}) {
    const token = getToken();

    return {
        "Content-Type": "application/json",
        ...extraHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export default function request(method, path, body = null, options = {}) {
    const payload = body == null ? null : JSON.stringify(body);

    return http.request(method, `${BASE_URL}${path}`, payload, {
        ...options,
        headers: buildHeaders(options.headers),
    });
}
