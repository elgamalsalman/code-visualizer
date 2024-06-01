// --- imports ---

import { Router } from "express";
import expressWS from "express-ws";

import ws_run_controller from "../controllers/api/ws/ws_run_controller.js";

// --- globals ---

const router = Router();
expressWS(router);

// --- routes ---

router.ws("/run", ws_run_controller.run);

// --- exports ---

export default router;
