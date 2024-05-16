// --- imports ---

import { Router } from "express";

import Auth_Handler from "../middlewares/auth_handler.js";
import Save_Controller from "../controllers/api/save_controller.js";
import Run_Controller from "../controllers/api/run_controller.js";

// --- globals ---

const router = Router();

let auth_handler = new Auth_Handler();
let save_controller = new Save_Controller();
let run_controller = new Run_Controller();

// --- routes ---

router.use(auth_handler.auth);
router.put("/save", save_controller.save);
router.get("/run", run_controller.run);

// --- exports ---

export default router;
