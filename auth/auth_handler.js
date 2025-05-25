import "dotenv/config";
import config from "../config.js";

import jwt from "jsonwebtoken";
import db from "../db/db.js";

const generate_access_token = (user_id) => {
	return jwt.sign(
		{ user_id, creation_timestamp: Date.now() },
		process.env.ACCESS_TOKEN_SECRET
	);
};

const generate_refresh_token = async (user_id) => {
	const { authentication_key: refresh_token_secret } =
		await db.users.get_user_info(user_id, ["authentication_key"]);
	return jwt.sign(
		{ user_id, creation_timestamp: Date.now() },
		refresh_token_secret
	);
};

const extract_access_token = (token) => {
	return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

const extract_refresh_token = async (user_id, token) => {
	const { authentication_key: refresh_token_secret } =
		await db.users.get_user_info(user_id, ["authentication_key"]);
	return jwt.verify(token, refresh_token_secret);
};

const has_access_token_expired = (token) => {
	const duration = Date.now() - token.creation_timestamp;
	return duration > config.auth.access_token_lifetime;
};

const has_refresh_token_expired = (token) => {
	const duration = Date.now() - token.creation_timestamp;
	return duration > config.auth.refresh_token_lifetime;
};

export {
	extract_access_token,
	extract_refresh_token,
	generate_access_token,
	generate_refresh_token,
	has_access_token_expired,
	has_refresh_token_expired,
};
