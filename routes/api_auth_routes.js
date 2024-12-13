// --- imports ---

import jwt from "jsonwebtoken";
import passport from "passport";
import { Router } from "express";

import "../utils/passport_utils.js";
import db from "../db/db.js";

import { send_email_verification } from "../services/email_service.js";

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
				verified: false,
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

// login route
(() => {
	const login_router = Router();
	login_router.post("/password", passport.authenticate("local"), (req, res) => {
		return res.status(200).send(req.user);
	});
	router.use("/login", login_router);
})();

// email verification
(async () => {
	const email_verification_router = Router();
	email_verification_router.post("/send", async (req, res) => {
		const { email } = req.body;
		try {
			const verification_hash = jwt.sign(
				{ email, date: Date.now() },
				process.env.HASHING_SALT
			);
			const link = `${process.env.SERVER_URL}/auth/email-verification/verify/${verification_hash}`;
			const { name } = await db.users.get_user_info(email, ["name"]);
			await send_email_verification(email, name, link);
			return res.status(200).send({ success: true });
		} catch (error) {
			return res.status(400).send({ error });
		}
	});
	email_verification_router.post("/verify/:token", async (req, res) => {
		const token = req.params.token;
		const { email, date } = jwt.verify(token, process.env.HASHING_SALT);
		const time_difference = Math.abs(date - Date.now());
		if (time_difference > process.env.VERIFICATION_LIFETIME) {
			return res.status(400).send({ error: "expired link" });
		} else {
			try {
				const updated = await db.users.update_user(email, { verified: true });
				if (updated) return res.status(200).send({ success: true });
				else throw Error("user not found");
			} catch (error) {
				return res.status(400).send({ error });
			}
		}
	});
	router.use("/email-verification", email_verification_router);
})();

// --- exports ---

export default router;
