// k6/run.js

import flow from "./core/active.js";
import { setup } from "./setup.js";

import admin from "./scenarios/admin-flow.js";
import user from "./scenarios/user.flow.js";
import read from "./scenarios/read.flow.js";
import load from "./scenarios/load.test.js";

export { setup };

// 환경변수로 시나리오 선택
const scenario = __ENV.SCENARIO || "load";

const flows = { admin, user, read, load };

export default function (data) {
    flows[scenario](data);
}

export const options = {
  systemTags: ["method", "url", "status"],
};
