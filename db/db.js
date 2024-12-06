import pool from "./db.config.js";
import { hash_password } from "../utils/security_utils.js";
import { PG_UNIQUE_VIOLATION } from "@drdgvhbh/postgres-error-codes";

const query = async (text, params) => {
	const start = Date.now();
	const res = await pool.query(text, params);
	const duration = Date.now() - start;
	console.log("executed query", { text, duration, rows: res.rowCount });
	return res;
};

const users = {
	create_user: async (user_info) => {
		const { email: input_email, name: input_name, password } = user_info;
		const password_hash = hash_password(password);

		// check that the user isn't already there
		var res;
		try {
			res = await query(
				"INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING *",
				[input_email, input_name, password_hash]
			);
		} catch (err) {
			// if email already exists
			if (
				err.code === PG_UNIQUE_VIOLATION &&
				err.constraint === "users_email_key"
			) {
				throw Error("email already exists");
			}

			// other issues
			console.log("error");
			console.log(err);
			return null;
		}

		const { email, name, creation_timestamp } = res.rows[0];
		return { email, name, creation_timestamp };
	},

	get_user: async (user_info) => {
		const { email, password: password_attempt } = user_info;
		const password_attempt_hash = hash_password(password_attempt);

		const res = await query(
			"SELECT email, name, creation_timestamp FROM users WHERE email = $1 AND password_hash = $2;",
			[email, password_attempt_hash]
		);

		if (res.rowsCount > 1) {
			throw "Duplications exist in the db!";
		} else if (res.rowCount === 0) {
			return null;
		} else {
			const { email, name, creation_timestamp } = res.rows[0];
			return { email, name, creation_timestamp };
		}
	},
};

export default { query, users };
