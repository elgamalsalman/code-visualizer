import config from "../config.js";

import jwt from "jsonwebtoken";

import db from "../db/db.js";
import {
	send_email_verification,
	send_password_reset_email,
} from "../services/email_service.js";
import { validate_password } from "../utils/security_utils.js";
import { validate_email } from "../utils/email_utils.js";
import {
	generate_access_token,
	generate_refresh_token,
} from "./auth_handler.js";

class Auth_Controller {
	constructor() {
		// empty constructor
	}

	register = {
		password: async (req, res, next) => {
			const { email, password, userInfo: user_info } = req.body;

			if (!validate_email(email))
				throw { status: 501, message: "invalid email" };
			if (!validate_password(password))
				throw { status: 501, message: "invalid password" };

			try {
				const user = await db.users.create_user({
					email,
					password,
					...user_info,
					verified: false,
				});

				return res
					.status(config.http_codes.success)
					.json({ success: true, user });
			} catch (error) {
				next({
					status: error.status || config.http_codes.failed,
					message: error.message || "user registeration failed",
				});
				return;
			}
		},
	};

	login = async (req, res, next) => {
		req.user = { id: 8 };
		console.log("logging in user:", req.user);
		const user = await db.users.get_user_info(req.user.id);
		res.cookie(
			config.cookies.access_token.name,
			generate_access_token(req.user.id),
			config.cookies.options
		);
		console.log(generate_refresh_token(req.user.id));
		res.cookie(
			config.cookies.refresh_token.name,
			generate_refresh_token(req.user.id),
			config.cookies.options
		);
		return res.status(config.http_codes.success).json({ success: true, user });
	};

	email_verification = {
		send: async (req, res, next) => {
			const email = req.query.email;
			try {
				const user_id = await db.users.get_user_by_email(email);
				const { name } = await db.users.get_user_info(user_id, ["name"]);

				const verification_hash = jwt.sign(
					{ user_id, date: Date.now() },
					process.env.GENERAL_SECRET
				);
				const link = `${process.env.SERVER_URL}/auth/email-verification/verify/${verification_hash}`;
				await send_email_verification(email, name, link);

				return res.status(config.http_codes.success).json({ success: true });
			} catch (error) {
				next({
					status: error.status || config.http_codes.failed,
					message: error.message || "sending verification email failed",
				});
			}
		},

		verify: async (req, res, next) => {
			const token = req.params.token;
			let user_id = null;
			let date = null;
			try {
				const payload = jwt.verify(token, process.env.GENERAL_SECRET);
				user_id = payload.user_id;
				date = payload.date;
			} catch (err) {
				next({
					status: config.http_codes.failed,
					message: "invalid email verification token",
				});
				return;
			}

			const time_difference = Date.now() - date;
			if (time_difference > config.auth.verification_lifetime) {
				next({
					status: config.http_codes.gone,
					message: "email verification token expired",
				});
				return;
			}

			try {
				await db.users.update_user(user_id, { verified: true });
				return res.status(config.http_codes.success).json({ success: true });
			} catch (err) {
				next({
					status: config.http_codes.failed,
					message: "failed to verify user",
				});
				return;
			}
		},
	};

	password_reset = {
		send: async (req, res, next) => {
			const email = req.query.email;

			try {
				const user_id = await db.users.get_user_by_email(email);
				const { name } = await db.users.get_user_info(user_id, ["name"]);
				const verification_hash = jwt.sign(
					{ user_id, date: Date.now() },
					process.env.GENERAL_SECRET
				);
				const link = `${process.env.SERVER_URL}/auth/password-reset/reset/${verification_hash}`;
				await send_password_reset_email(email, name, link);
				return res.status(config.http_codes.success).json({ success: true });
			} catch (error) {
				next({
					status: error.status || config.http_codes.failed,
					message: error.message || "sending password reset email failed",
				});
				return;
			}
		},

		reset: async (req, res, next) => {
			const token = req.params.token;
			const { user_id, date } = jwt.verify(token, process.env.GENERAL_SECRET);

			const time_difference = Math.abs(date - Date.now());
			if (time_difference > config.auth.password_reset_lifetime) {
				next({
					status: config.http_codes.gone,
					message: "password reset token expired",
				});
				return;
			}

			try {
				const { password } = req.body;
				await db.users.update_user(user_id, {
					password,
				});
				return res.status(config.http_codes.success).json({ success: true });
			} catch (error) {
				next({
					status: error.status || config.http_codes.failed,
					message: error.message || "password reset failed",
				});
				return;
			}
		},
	};
}

const auth_controller = new Auth_Controller();

export default auth_controller;
