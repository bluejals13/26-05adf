// scenarios/read.flow.js

import { MenuAPI } from "../api/menu.api.js";

export default function readFlow() {
    MenuAPI.getMenus();
}
