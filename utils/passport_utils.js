import passport from "passport";
import passportLocal from "passport-local";

import db from "../db/db.js";
import { verify_password } from "./security_utils.js";

// local strategy
passport.use(
	"local",
	new passportLocal.Strategy(
		{ usernameField: "email", passwordField: "password", session: false },
		async (email, password, done) => {
			const res = await db.query(
				"SELECT username, password_hash FROM users WHERE email = $1;",
				[email]
			);

			if (res.rowsCount > 1) {
				return done("Duplications exist in the db!");
			} else if (res.rowCount === 0) {
				return done(null, false);
			} else {
				const { username, password_hash } = res.rows[0];
				if (verify_password(password, password_hash)) {
					return done(null, { username });
				} else {
					// incorrect password
					return done(null, false);
				}
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, JSON.stringify(user));
});

passport.deserializeUser((user, done) => {
	done(err, JSON.parse(user));
});
