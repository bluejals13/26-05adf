// k6/core/active.js		행위 혹은 작업

import { UserAPI } from "../api/user.api.js";

export default function () {
    const res = UserAPI.getUsers();

    if (res.status !== 200) {
        console.error("getUsers failed:", res.status, res.body);
        return;
    }

    const users = res.json();

    if (!users || users.length === 0) {
        console.error("No users returned");
        return;
    }

    const user = users[0];

    UserAPI.changeStatus(user.id, "ACTIVE");
}
