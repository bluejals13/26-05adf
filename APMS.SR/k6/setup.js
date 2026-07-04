// k6/setup.js

import { login } from "./api/auth.api.js";

export function setup() {
    return {
        token: login("test", "1378"),
    };
}
