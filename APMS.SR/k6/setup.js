// k6/setup.js

import { login } from "./api/auth.api.js";
import active from "./core/active.js";

export function setup() {
  return login("test", "1378");
}

export default function (data) {
    active(data);
}
