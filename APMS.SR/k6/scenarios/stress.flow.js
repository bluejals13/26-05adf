// scenarios/stress.flow.js

import adminFlow from "./admin.flow.js";

export const options = {
    stages: [
        { duration: "1m", target: 10 },
        { duration: "2m", target: 50 },
        { duration: "1m", target: 100 },
        { duration: "1m", target: 0 },
    ],
    thresholds,
};

export default function () {
    adminFlow();
}
