// k6/core/active.js		행위 혹은 작업

import { UserAPI } from "../api/user.api.js";

export default function () {
    const res = UserAPI.getUsers();

    if (res.status !== 200) {
        console.error("getUsers failed:", res.status);
        return;
    }

    const users = res.json();

    if (!users || users.length === 0) return;

    UserAPI.changeStatus(users[0].id, "ACTIVE");
}
