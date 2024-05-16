import config from "../config.js";

export default class {
	auth = async (req, res, next) => {
		// TODO: proper user authentication
		if (req.body.user_id !== config.testing.test_user_id) {
			throw new Error("invalid user id");
		}

		next();
	};
}
