// k6/setup.js

import { login } from "./api/auth.api.js";

export function setup() {
    const res = login("test", "1378");
    
    if (res.status !== 200) { throw new Error("login failed"); }
    
    return { token: res.json("token") };
}
