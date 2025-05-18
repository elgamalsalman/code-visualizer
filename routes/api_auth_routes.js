// --- imports ---

import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Router } from "express";

import "../utils/passport_utils.js";
import db from "../db/db.js";

import {
	send_email_verification,
	send_password_reset_email,
} from "../services/email_service.js";
import config from "../config.js";

// --- globals ---

const router = Router();

// --- routes ---

// FIXME: saml metadata
const saml_sp_metadata_path = path.join(
	process.cwd(),
	"config",
	"saml-metadata.xml"
);
const saml_sp_metadata = fs.readFileSync(saml_sp_metadata_path, "utf8");
router.get("/saml/metadata", (req, res) => {
	res.type("xml");
	res.send(saml_sp_metadata);
});

// register route
(() => {
	const register_router = Router();
	register_router.post("/password", async (req, res) => {
		const { email, password, userInfo: user_info } = req.body;
		const user = await db.users.create_user({
			email,
			password,
			...user_info,
			verified: false,
		});

		res.status(200).send(user);
	});
	router.use("/register", register_router);
})();

// login route
(() => {
	const login_router = Router();
	login_router.post(
		"/password",
		passport.authenticate("local", { failWithError: true }),
		(req, res) => {
			return res.status(200).send(req.user);
		}
	);
	login_router.get("/nyu", passport.authenticate("nyu"), (req, res) => {
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
		if (time_difference > config.auth.verification_lifetime) {
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

// password reset
(async () => {
	const password_reset_router = Router();
	password_reset_router.post("/send", async (req, res) => {
		const { email } = req.body;
		try {
			const verification_hash = jwt.sign(
				{ email, date: Date.now() },
				process.env.HASHING_SALT
			);
			const link = `${process.env.SERVER_URL}/auth/password-reset/reset/${verification_hash}`;
			const { name } = await db.users.get_user_info(email, ["name"]);
			await send_password_reset_email(email, name, link);
			return res.status(200).send({ success: true });
		} catch (error) {
			return res.status(400).send({ error });
		}
	});
	password_reset_router.post("/reset/:token", async (req, res) => {
		const token = req.params.token;
		const { email, date } = jwt.verify(token, process.env.HASHING_SALT);
		const time_difference = Math.abs(date - Date.now());
		if (time_difference > config.auth.password_reset_lifetime) {
			return res.status(400).send({ error: "expired link" });
		} else {
			try {
				const { password } = req.body;
				const updated = await db.users.update_user(email, {
					password,
				});
				if (updated) return res.status(200).send({ success: true });
				else throw Error("user not found");
			} catch (error) {
				return res.status(400).send({ error });
			}
		}
	});
	router.use("/password-reset", password_reset_router);
})();

// --- auth error handling ---

router.use((err, req, res, next) => {
	console.log("error");
	console.log(err.message);

	if (err.message === "Unauthorized") {
		return res.status(409).send({ error: "Invalid Credentials" });
	} else return res.status(500).send({ error: "Unkown Error" });
});

// --- exports ---

export default router;
