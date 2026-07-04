// k6/setup.js

import { login } from "./api/auth.api.js";
import active from "./core/active.js";


export default function () {
    login("test", "1378");
    active();
}
