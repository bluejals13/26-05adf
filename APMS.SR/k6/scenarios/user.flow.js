// scenarios/user.flow.js

import { UserAPI } from "../api/user.api.js";

export default function () {
    UserAPI.getUsers();
}