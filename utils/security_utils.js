import bcrypt from "bcrypt";

const hash_password = (password) => {
	return bcrypt.hashSync(password, process.env.HASHING_SALT);
};

const verify_password = (password_attempt, reference_hash) => {
	return bcrypt.compareSync(password_attempt, reference_hash);
};

export { hash_password, verify_password };
