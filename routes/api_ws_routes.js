// --- imports ---

import { Router } from "express";
import expressWS from "express-ws";

// --- globals ---

const router = Router();
expressWS(router);

// --- routes ---

router.ws("/run", (ws, req) => {
	const { user_id } = req.body;

	ws.on("message", (message) => {
		console.log(`message to ${user_id}: {${message}}!`);
	});
});

// --- exports ---

export default router;
