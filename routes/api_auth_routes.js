// --- imports ---

import passport from "passport";
import { Router } from "express";

import "../utils/passport_utils.js";
import db from "../db/db.js";

// --- globals ---

const router = Router();

// --- routes ---

// register route
(() => {
	const register_router = Router();
	register_router.post("/password", async (req, res) => {
		const { email, password, userInfo: user_info } = req.body;
		try {
			const user = await db.users.create_user({
				email,
				password,
				...user_info,
			});

			res.status(200).send(user);
		} catch (err) {
			if (err.message === "email already exists") {
				return res.status(409).send({ error: err.message });
			}
			return res.status(500).send({ error: err.message });
		}
	});
	router.use("/register", register_router);
})();

// register route
(() => {
	const login_router = Router();
	login_router.post("/password", passport.authenticate("local"), (req, res) => {
		return res.status(200).send(req.user);
	});
	router.use("/login", login_router);
})();

// --- exports ---

export default router;
