// k6/run.js

import flow from "./core/active.js";
import { setup } from "./setup.js";

import admin from "./scenarios/admin-flow.js";
import user from "./scenarios/user.flow.js";
import read from "./scenarios/read.flow.js";
import load from "./scenarios/load.test.js";

export { setup };

// 환경변수로 시나리오 선택
const scenario_1 = __ENV.1_SCENARIO || "user";
const scenario_2 = __ENV.2_SCENARIO || "read";
const scenario_3 = __ENV.3_SCENARIO || "admin";

const flows = { admin, user, read, load };

export default function (data) {
    
    const userRatio = Number(__ENV.USER_RATIO || 0.70);
    const readRatio = Number(__ENV.READ_RATIO || 0.27);
    const adminRatio = Number(__ENV.ADMIN_RATIO || 0.03);
    
    if (r < userRatio) scenario_1(data);
    else if (r < userRatio + readRatio) read(data);
    else admin(data);
    
    //flows[scenario](data);
}

export const options = {
  systemTags: ["method", "url", "status"],
};
