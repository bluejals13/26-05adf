// k6/setup.js

import { login } from "./api/auth.api.js";

export function setup() {
    const res = login("test", "1378");
    
    const body = res.json();   // ✅ 여기서 파싱
    
    const token = body.json("token"); // ⭐ 핵심
    
    return { token };
}
