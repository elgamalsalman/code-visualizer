// --- imports ---

import { Router } from "express";

import api_ws_routes from "./api_ws_routes.js";

import auth from "../middlewares/auth_handler.js";
import ws_header from "../middlewares/ws_header_handler.js";

import save_controller from "../controllers/api/save_controller.js";
import pull_controller from "../controllers/api/pull_controller.js";
import run_controller from "../controllers/api/run_controller.js";

// --- globals ---

const router = Router();

// --- routes ---

router.use("/ws", ws_header);
router.use(auth);

router.put("/save", save_controller.save);
router.post("/pull", pull_controller.pull);
router.put("/run", run_controller.run);

router.use("/ws", api_ws_routes);

// --- exports ---

export default router;
