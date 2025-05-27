import { Router } from "express";

import run_controller from "../../controllers/run_controller.js";
import expressWs from "express-ws";

const run_router = Router();
expressWs(run_router);

// --- routes ---

run_router.ws("/run", run_controller.run);

// --- exports ---

export default run_router;
