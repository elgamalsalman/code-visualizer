import config from "../config.js";

import db from "../db/db.js";

const get = async (req, res, next) => {
	const { user_id } = req.auth;
	try {
		const user = await db.users.get_user_info(user_id);
		return res.status(config.http_codes.success).json(user);
	} catch (error) {
		next({
			status: error.status || config.http_codes.failed,
			message: error.message || "fetching user failed",
		});
	}
};

const user_controller = { get };

export default user_controller;
