// k6/setup.js

import { login } from "./api/auth.api.js";
//import active from "./core/active.js";

export function setup() {
  const token = login("test", "1378");

  return {
    token,
  };
}
