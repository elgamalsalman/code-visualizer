// --- imports ---
import config from "../config.js";

import fs from "fs";
import path from "path";
import passport from "passport";
import { Router } from "express";

import "../utils/passport_utils.js";

import auth_controller from "../auth/auth_controller.js";

// --- globals ---

const router = Router();

// --- routes ---

// FIXME: saml metadata
const saml_sp_metadata_path = path.join(
	process.cwd(),
	"auth",
	"certificates",
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
	register_router.post("/password", auth_controller.register.password);
	router.use("/register", register_router);
})();

// login route
(() => {
	const login_router = Router();
	login_router.post(
		"/password",
		// passport.authenticate("local", { session: false, failWithError: true }),
		auth_controller.login
	);
	login_router.get(
		"/nyu",
		passport.authenticate("nyu", { session: false, failWithError: true }),
		auth_controller.login
	);
	router.use("/login", login_router);
})();

// email verification
(async () => {
	const email_verification_router = Router();
	email_verification_router.post(
		"/send",
		auth_controller.email_verification.send
	);
	email_verification_router.post(
		"/verify/:token",
		auth_controller.email_verification.verify
	);
	router.use("/email-verification", email_verification_router);
})();

// password reset
(async () => {
	const password_reset_router = Router();
	password_reset_router.post("/send", auth_controller.password_reset.send);
	password_reset_router.post(
		"/reset/:token",
		auth_controller.password_reset.reset
	);
	router.use("/password-reset", password_reset_router);
})();

// --- auth error handling ---

router.use((err, req, res, next) => {
	console.log("auth error:", err);

	const default_error = {
		status: config.http_codes.failed,
		message: "authentication error",
	};
	res.status(err.status || default_error.status).json(err || default_error);
});

// --- exports ---

export default router;
