// k6/setup.js

import { login } from "./api/auth.api.js";

export function setup() {
    const token = login("test", "1378");

    return { token, };
}
