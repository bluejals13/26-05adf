// k6/setup.js

import { login } from "./api/auth.api.js";

export function setup() {
    const res = login("test", "1378");
    
    const token = res.json("token"); // ⭐ 핵심
    
    return { token };
}
