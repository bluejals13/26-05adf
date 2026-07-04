// k6/core/active.js		행위 혹은 작업

import { UserAPI } from "../api/user.api.js";

export default function ({ token }) {
    const res = UserAPI.getUsers(token);

    if (res.status !== 200) { console.error(`getUsers failed: ${res.status}`);
        return;
    }

    const users = res.json();

    if (!users?.length) { return; }

    UserAPI.changeStatus(token, users[0].id, "ACTIVE");
}
