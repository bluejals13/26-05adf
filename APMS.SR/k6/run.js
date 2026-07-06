// k6/run.js

import flow from "./core/active.js";
import { setup } from "./setup.js";

import admin from "./scenarios/admin-flow.js";
import user from "./scenarios/user.flow.js";
import read from "./scenarios/read.flow.js";
import load from "./scenarios/load.test.js";

export { setup };

// 환경변수로 시나리오 선택
//const SCENA = __ENV.SCENA || "1"
//const scenario = __ENV.scenario || "user"
//const flows = { admin, user, read, load };

export default function (data) {
        
    const stage = __ENV.STAGE || "normal";

    let userRatio, readRatio, adminRatio;
    
    if (stage === "warmup") {
        userRatio = 0.9;
        readRatio = 0.1;
        adminRatio = 0;
    }

    else if (stage === "normal") {
        userRatio = 0.7;
        readRatio = 0.27;
        adminRatio = 0.03;
    }

    else if (stage === "stress") {
        userRatio = 0.5;
        readRatio = 0.4;
        adminRatio = 0.1;
    }
        
    const r = Math.random();
        
    if (r < userRatio) user(data);
    else if (r < userRatio + readRatio) read(data);
    else admin(data);
        
    }
    // flows[scenario](data); 
}

export const options = {
  systemTags: ["method", "url", "status"],
};
