// scenarios/admin-flow.js

import { sleep } from "k6";
import { UserAPI } from "../api/user.api.js";
import { MenuAPI } from "../api/menu.api.js";

export default function () {
    // 1. 사용자 조회
    const res = UserAPI.getUsers(token);
    if (res.status !== 200) { console.error(`getUsers failed: ${res.status}`); return; }
    const users = res.json();
    if (!users || users.length === 0) { return; }
    
    const userId = users[0].id;
    
    sleep(1);

    // 2. 상태 변경
    UserAPI.changeStatus(userId, "ACTIVE");

    sleep(1);

    // 3. 메뉴 생성
    MenuAPI.createMenu({
        name: "Coffee",
        price: 5000,
    });
}
