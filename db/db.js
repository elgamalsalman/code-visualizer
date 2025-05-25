import pool from "./db.config.js";
import { generate_secret, hash_password } from "../utils/security_utils.js";

const query = async (text, params) => {
	try {
		const start = Date.now();
		const res = await pool.query(text, params);
		const duration = Date.now() - start;
		// console.log("executed query", {
		// 	text,
		// 	params,
		// 	duration,
		// 	rows: res.rowCount,
		// });
		return res;
	} catch (error) {
		console.log("failed query", { text, params });
		throw error;
	}
};

const users = {
	create_user: async (user_info) => {
		const {
			email: input_email,
			name: input_name,
			password,
			verified,
		} = user_info;
		const password_hash = hash_password(password);
		const authentication_key = generate_secret();

		// check that the user isn't already there
		var res;
		try {
			res = await query(
				"INSERT INTO users (email, name, password_hash, verified, authentication_key) VALUES ($1, $2, $3, $4, $5) RETURNING *",
				[input_email, input_name, password_hash, verified, authentication_key]
			);
		} catch (err) {
			// if email already exists
			if (err.constraint === "unique_email") {
				throw Error("email already exists");
			}
			// other issues
			throw err;
		}

		const { email, name, creation_timestamp } = res.rows[0];
		return { email, name, creation_timestamp };
	},

	auth_password: async (email, password_attempt) => {
		const password_attempt_hash = hash_password(password_attempt);

		const res = await query(
			"SELECT id FROM users WHERE email = $1 AND password_hash = $2;",
			[email, password_attempt_hash]
		);

		if (res.rowCount > 1) {
			throw new Error("duplications in users database");
		} else if (res.rowCount === 0) {
			throw new Error("user not found");
		} else {
			const { id } = res.rows[0];
			return id;
		}
	},

	get_user_by_email: async (email) => {
		const res = await query(`SELECT id FROM users WHERE email = $1;`, [email]);

		if (res.rowCount > 1) {
			throw new Error("duplications in users database");
		} else if (res.rowCount === 0) {
			throw new Error("user not found");
		} else {
			return res.rows[0].id;
		}
	},

	get_user_info: async (id, user_info_props = null) => {
		if (!user_info_props) {
			user_info_props = ["id", "name", "email", "creation_timestamp"];
		}

		const res = await query(
			`SELECT ${user_info_props.join(", ")} FROM users WHERE id = $1;`,
			[id]
		);

		if (res.rowCount > 1) {
			throw new Error("duplications in users database");
		} else if (res.rowCount === 0) {
			throw new Error("user not found");
		} else {
			const user_info = {};
			for (const prop of user_info_props) {
				user_info[prop] = res.rows[0][prop];
			}
			return user_info;
		}
	},

	update_user: async (id, props) => {
		// substitute password with hash
		if (props.password) {
			props = {
				...props,
				password_hash: hash_password(props.password),
			};
			delete props.password;
		}

		let operand_i = 0;
		const operands_list = [];
		const op = (value) => {
			operand_i += 1;
			operands_list.push(value);
			return `$${operand_i}`;
		};
		const multi = Object.keys(props).length > 1;
		const res = await query(
			`
			UPDATE users
			SET ${multi ? "(" : ""}
			${Object.keys(props).join(", ")}
			${multi ? ")" : ""} = ${multi ? "(" : ""}
			${Object.values(props)
				.map((v) => op(v))
				.join(", ")}
			${multi ? ")" : ""}
				WHERE id = ${op(id)};
			`,
			operands_list
		);

		if (res.rowCount > 1) {
			throw new Error("duplications in users database");
		} else if (res.rowCount === 0) {
			throw new Error("user not found");
		} else {
			return true;
		}
	},

	logout_user_globally: async (id) => {
		// change the refresh token authentication key
		await update_user(id, { authentication_key: generate_secret() });
	},
};

export default { query, users };
