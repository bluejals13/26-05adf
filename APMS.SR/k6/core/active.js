// k6/active.js		행위 혹은 작업

import { UserAPI } from "../api/user.api.js";

export default function () {
    const users = UserAPI.getUsers().json();
    UserAPI.changeStatus(users[0].id, "ACTIVE");
}