// k6/core/auth.js		인증

import request from "./request.js";

let token = null;

export function setToken(t) {
    token = t;
}

export function getToken() {
    return token;
}

export function clearToken() {
    token = null;
}
