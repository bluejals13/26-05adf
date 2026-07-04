// setup.js

import { login } from "./core/auth.js";
import active from "./core/active.js";
import request from "./core/request.js";

export function setup() {
    login();
}
