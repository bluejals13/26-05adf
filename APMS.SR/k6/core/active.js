// k6/active.js		행위 혹은 작업

import { UserAPI } from "../api/user.api.js";

export default function active() {
    const users = UserAPI.getUsers().json();

    if (users.length === 0) {
        return;
    }

    UserAPI.changeStatus(users[0].id, "ACTIVE");
}
