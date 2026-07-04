// scenarios/soak.test.js

import userFlow from "./user.flow.js";
import readFlow from "./read.flow.js";
import adminFlow from "./admin.flow.js";

//import { thresholds } from "../config/thresholds.js";

export const options = { vus: 80,
    duration: 20m~40m
//    thresholds,
};

export default function () {
    readFlow();
}
