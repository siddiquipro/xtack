import type { DebugLogger } from "node:util";
import { debuglog } from "node:util";

const debug: DebugLogger = debuglog("xtack");

export default debug;
