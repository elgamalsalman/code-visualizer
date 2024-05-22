// --- imports ---

import { Router } from "express";

import api_ws_routes from "./api_ws_routes.js";

import auth from "../middlewares/auth_handler.js";
import ws_header from "../middlewares/ws_header_handler.js";

import Save_Controller from "../controllers/api/save_controller.js";
import Run_Controller from "../controllers/api/run_controller.js";

// --- globals ---

const router = Router();

let save_controller = new Save_Controller();
let run_controller = new Run_Controller();

// --- routes ---

router.use("/ws", ws_header);
router.use(auth);

router.put("/save", save_controller.save);
router.get("/run", run_controller.run);
router.use("/ws", api_ws_routes);

// --- exports ---

export default router;
