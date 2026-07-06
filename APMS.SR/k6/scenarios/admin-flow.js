// scenarios/admin-flow.js

import { sleep } from "k6";
import { UserAPI } from "../api/user.api.js";
import { MenuAPI } from "../api/menu.api.js";

function Domenu() {
    const Lists = [ "Americano", "Latte", "Cappuccino", "Mocha", "Espresso", "Macchiato", "Cold Brew"];
    const name = Lists[Math.floor(Math.random() * Lists.length)];
    const price = Math.floor(Math.random() * 5000) + 3000;
    return { name, price };
}

export default function (data) {
    // 1. 사용자 조회
    let users = [];
    const token = data.token;
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
    const menu = Domenu();
    
    const res3 = MenuAPI.createMenu(token, menu);
    if (![200, 201].includes(res3.status)) { console.error("createMenu failed:", res3.status, res3.body);
        return; }
    let created;
    try { created = res3.json();
    } catch (e) { console.error("Invalid JSON:", res3.body);
        return; }

    const menuId = created?.id;
    if (!menuId) { console.error("No menuId returned");
        return; }
    
    // 4. 메뉴 삭제 (랜덤 삭제 확률)
    if (Math.random() < 0.7 && menuId) { const delRes = MenuAPI.deleteMenu(token, menuId);

        if (delRes.status !== 200 && delRes.status !== 204) { console.error("deleteMenu failed:", delRes.status, delRes.body); }
    }
    
    if (res3.status !== 200) { console.error(`createMenu failed: ${res3.status}`); }
}
