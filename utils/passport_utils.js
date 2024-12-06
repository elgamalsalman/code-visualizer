import passport from "passport";
import passportLocal from "passport-local";

import db from "../db/db.js";

// local strategy
passport.use(
	"local",
	new passportLocal.Strategy(
		{ usernameField: "email", passwordField: "password", session: false },
		async (email, password, done) => {
			const user = await db.users.get_user({ email, password });

			if (user === null) done(null, false);
			else done(null, user);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, JSON.stringify(user));
});

passport.deserializeUser((user, done) => {
	done(null, JSON.parse(user));
});
