// k6/core/request.js		통신규격

import http from "k6/http";
import { config } from "../config/env.js";

export default function request(method, path, token, body = null, options = {}) {
    
    if (!config.baseUrl) { throw new Error("BASE_URL is not defined"); }
    
    const payload = body && typeof body === "object" ? JSON.stringify(body) : body;
    
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}`, }),
        ...(options.headers ?? {}),
    };
    
    const mergedOptions = {
        tags: options.tags ?? {},
        headers,
        ...(options.timeout ? { timeout: options.timeout } : {}),
    };
    
    return http.request(method, `${config.baseUrl}${path}`, payload, mergedOptions );
}
