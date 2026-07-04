// k6/core/request.js		통신규격

import http from "k6/http";
import { config } from "../config/env.js";

export default function request(method, path, body, options = {}, token) {
    const payload = body ? JSON.stringify(body) : null;
    
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
        ...(token && { Authorization: `Bearer ${token}`, }),
    };

    return http.request(method, `${config.baseUrl}${path}`, payload, {
        ...options, headers, });
}
