// scenarios/spike.test.js

import adminFlow from "./admin.flow.js";

export const options = {
    stages: [
        { duration: "10s", target: 10 },
        { duration: "10s", target: 200 },
        { duration: "30s", target: 10 },
    ],
    thresholds,
};

export default function () {
    adminFlow();
}
