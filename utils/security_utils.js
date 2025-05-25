import config from "../config.js";

import crypto from "crypto";

const generate_random_hash = (length) => {
	const hash = crypto.randomBytes(Math.ceil(length / 2)).toString("hex");
	return length % 2 === 0 ? hash : hash.slice(0, -1);
};

const hash_password = (password) => {
	return crypto
		.scryptSync(
			password,
			process.env.PASSWORD_SECRET,
			config.auth.hash_length / 2
		)
		.toString("hex");
};

const verify_password = (password_attempt, reference_hash) => {
	// compare while preventing timing attacks
	return crypto.timingSafeEqual(
		hash_password(password_attempt),
		reference_hash
	);
};

const generate_secret = () => {
	return generate_random_hash(config.auth.secret_length);
};

const validate_password = (password) => {
	const min_password_length = 8;
	const special_characters = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~]/;
	const lowercase_letters = /[a-z]/;
	const uppercase_letters = /[A-Z]/;
	const numbers = /\d/;
	if (
		password.length >= min_password_length
		// lowercase_letters.test(password) &&
		// uppercase_letters.test(password) &&
		// special_characters.test(password) &&
		// numbers.test(password)
	) {
		return true;
	} else return false;
};

export { hash_password, verify_password, generate_secret, validate_password };
