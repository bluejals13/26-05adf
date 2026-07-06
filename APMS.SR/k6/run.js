// k6/run.js

import flow from "./core/active.js";
import { setup } from "./setup.js";

import admin from "./scenarios/admin-flow.js";
import user from "./scenarios/user.flow.js";
import read from "./scenarios/read.flow.js";
import load from "./scenarios/load.test.js";

export { setup };

// 환경변수로 시나리오 선택
const SCENA = __ENV.SCENA || "1"

const scenario = __ENV.scenario || "user"

const flows = { admin, user, read, load };

export default function (data) {
    if ( SCENA == "1" ){
        
    const userRatio = Number(__ENV.USER_RATIO || 0.70);
    const readRatio = Number(__ENV.READ_RATIO || 0.27);
    
    const r = Math.random();
    
    if (r < userRatio) user(data);
    else if (r < userRatio + readRatio) read(data);
    else admin(data);
        
    }
    else if ( SCENA == "2" ){
    
    flows[scenario](data);
        
    }
}

export const options = {
  systemTags: ["method", "url", "status"],
};
