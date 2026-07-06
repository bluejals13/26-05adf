// scenarios/user.flow.js

import { UserAPI } from "../api/user.api.js";

export default function () {
    const res = UserAPI.getUsers(token);
    if (res.status !== 200) console.log(res.status); return;
}
