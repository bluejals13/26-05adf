// scenarios/load.test.js

import adminFlow from "./admin.flow.js";
import userFlow from "./user.flow.js";
//import { thresholds } from "../config/thresholds.js";

export const options = { vus: 50,
    duration: "2m",
//    thresholds,
};

export default function () {
    adminFlow();
    userFlow();
}
