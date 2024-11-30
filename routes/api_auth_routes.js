// --- imports ---

import passport from "passport";
import { Router } from "express";

import "../utils/passport_utils.js";

// --- globals ---

const router = Router();

// --- routes ---

router.post(
	"/password",
	passport.authenticate("local", { failureRedirect: "/" }),
	(req, res) => {
		console.log(req.user);
		res.send(req.user);
	}
);

// --- exports ---

export default router;
