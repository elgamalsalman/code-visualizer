import { Router } from "express";

import user_controller from "../../controllers/user_controller.js";

const user_router = Router();

// --- routes ---

user_router.get("/get", user_controller.get);

// --- exports ---

export default user_router;
