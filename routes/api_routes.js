// --- imports ---

import { Router } from "express";

import api_auth_routes from "./api/auth_routes.js";

import auth from "../middlewares/auth_middleware.js";

import entity_router from "./api/entity_routes.js";
import run_router from "./api/run_routes.js";
import user_router from "./api/user_routes.js";

// --- globals ---

const router = Router();

// --- logging ---

router.use((req, res, next) => {
	console.log({ method: req.method, url: req.url, body: req.body });
	next();
});

// --- routes ---

// unauthorized api
(() => {
	router.use("/auth", api_auth_routes);
})();

// authorized api
(() => {
	const auth_router = Router();
	auth_router.use(auth);

	auth_router.use("/entities", entity_router);
	auth_router.use("/runs", run_router);
	auth_router.use("/users", user_router);

	router.use(auth_router);
})();

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
