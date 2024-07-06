import config from "../config.js";

const auth = async (req, res, next) => {
	// TODO: proper user authentication
	if (req.body.user_id !== config.testing.test_user_id) {
		res
			.status(config.http_codes.failed)
			.send(
				JSON.stringify(new Error(`invalid user_id of ${req.body.user_id}`))
			);
		console.error("invlaid user_id!");
		return;
	}

	next();
};

export default auth;
