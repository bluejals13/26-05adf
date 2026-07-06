// scenarios/admin-flow.js

import { sleep } from "k6";
import { UserAPI } from "../api/user.api.js";
import { MenuAPI } from "../api/menu.api.js";

export default function (data) {
    // 1. 사용자 조회
    let users = [];
    const token = data?.token;
    if (!token) { console.error("missing token");     return; }
    
    const res = UserAPI.getUsers(token);
    if (res.status !== 200) { console.error(`getUsers failed: ${res.status}`); return; }
    
    try { users = res.json();
    } catch (e) { console.error("Invalid JSON response");
    return; 
    }
    
    if (!users || users.length === 0) { return; }
    
    const userId = users[0].id;
    
    sleep(1);

    // 2. 상태 변경
    const res2 = UserAPI.changeStatus(token, userId, "ACTIVE");
    if (res2.status !== 200) { console.error(`changeStatus failed: ${res2.status}`); }
    
    sleep(1);

    // 3. 메뉴 생성
    const res3 = MenuAPI.createMenu(token, {
        name: "Coffee",
        price: 5000,
    });
    if (res3.status !== 200) { console.error(`createMenu failed: ${res3.status}`); }
}
