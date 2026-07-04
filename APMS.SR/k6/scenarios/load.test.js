// scenarios/load.test.js

import adminFlow from "./admin.flow.js";
import userFlow from "./user.flow.js";

export default function () {
    adminFlow();
    userFlow();
}