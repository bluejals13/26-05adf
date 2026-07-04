// k6/core/request.js		통신규격

import { getToken } from "./auth.js";

export default function request(method, path, body, options = {}) {
    const token = getToken();

    return http.request(method, path, body, {
        ...options,
        headers: {
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    });
}
