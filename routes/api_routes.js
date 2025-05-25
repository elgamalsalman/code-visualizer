// --- imports ---

import { Router } from "express";

import api_auth_routes from "./api_auth_routes.js";
import api_ws_routes from "./api_ws_routes.js";

import auth from "../middlewares/auth_middleware.js";
import ws_header from "../middlewares/ws_header_middleware.js";

import push_controller from "../controllers/api/push_controller.js";
import pull_controller from "../controllers/api/pull_controller.js";
import run_controller from "../controllers/api/run_controller.js";

// --- globals ---

const router = Router();

// --- middlewares ---

router.use("/ws", ws_header);

// --- testing ---

router.use((req, res, next) => {
	console.log({ method: req.method, url: req.url, body: req.body });
	next();
});

// --- routes ---

router.use("/auth", api_auth_routes);

router.put("/push", auth, push_controller.push);
router.post("/pull/file_tree", auth, pull_controller.file_tree);
router.post("/pull/entities", auth, pull_controller.entities);
router.put("/run", auth, run_controller.run);

router.use("/ws", auth, api_ws_routes);

// --- api error handling ---

router.use((err, req, res, next) => {
	console.log("// err:", err);
	const default_error = { status: 500, message: "Internal Server Error" };
	res
		.status(err.status || default_error.status)
		.json({ error: err || default_error });
});

// --- exports ---

export default router;
