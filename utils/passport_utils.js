import config from "../config.js";

import passport from "passport";
import passportLocal from "passport-local";
import { Strategy as SamlStrategy } from "passport-saml";

import db from "../db/db.js";

// local strategy
passport.use(
	"local",
	new passportLocal.Strategy(
		{ usernameField: "email", passwordField: "password", session: false },
		async (email, password, done) => {
			try {
				const id = await db.users.auth_password(email, password);
				done(null, { id });
			} catch (err) {
				done({
					status: config.http_codes.unauthorized,
					message: "invalid credentials",
				});
			}
		}
	)
);

// nyu strategy
passport.use(
	"nyu",
	new SamlStrategy(
		{
			entryPoint: config.auth.methods.nyu.entry_point,
			issuer: config.auth.saml_id,
			callbackUrl: process.env.SERVER_URL + "/auth/login/nyu/callback",
			cert: config.auth.methods.nyu.certificate,
		},
		(profile, done) => {
			console.log("Authenticated user:", profile);
			return done(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, JSON.stringify(user));
});

passport.deserializeUser((user, done) => {
	done(null, JSON.parse(user));
});
