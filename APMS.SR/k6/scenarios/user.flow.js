// scenarios/user.flow.js

import { UserAPI } from "../api/user.api.js";

export default function () {
    const token = data?.token;
    
    const res = UserAPI.getUsers(token);
    if (!res) console.log(res.status); return;
}
