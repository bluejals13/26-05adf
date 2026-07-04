// k6/run.js

import flow from "./core/active.js;
import { setup } from "./setup.js";

export { setup };

export default function (data) {
    flow(data);
}
