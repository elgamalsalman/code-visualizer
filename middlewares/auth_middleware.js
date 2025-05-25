import config from "../config.js";

import {
	extract_access_token,
	extract_refresh_token,
	generate_access_token,
	has_access_token_expired,
	has_refresh_token_expired,
} from "../auth/auth_handler.js";

const auth = async (req, res, next) => {
	// ensure authentication data isn't written by user
	req.auth = null;
	const {
		[config.cookies.access_token.name]: encoded_access_token,
		[config.cookies.refresh_token.name]: encoded_refresh_token,
	} = req.cookies;

	try {
		const access_token = extract_access_token(encoded_access_token);
		if (!has_access_token_expired(access_token)) {
			req.auth = { user_id: access_token.user_id };
			next();
			return;
		}

		const refresh_token = await extract_refresh_token(
			access_token.user_id,
			encoded_refresh_token
		);
		if (!has_refresh_token_expired(refresh_token)) {
			res.cookie(
				config.cookies.access_token.name,
				generate_access_token(access_token.user_id),
				config.cookies.options
			);

			// encode user_id
			req.auth = { user_id: access_token.user_id };
			next();
			return;
		}

		// if both refresh is also expired then ask for a re-login
		next({
			status: config.http_codes.unauthorized,
			message: "session expired",
			session_duration: process.env.refresh_token_lifetime,
		});
	} catch (err) {
		// invalid tokens
		next({
			status: config.http_codes.unauthorized,
			message: "unauthorized",
		});
	}
};

export default auth;
