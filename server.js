import "dotenv/config";

import path from "path";
import http from "http";

import cors from "cors";
import express from "express";
import session from "express-session";
import expressWS from "express-ws";
import passport from "passport";

import api_routes from "./routes/api_routes.js";

import config from "./config.js";
import { sleep } from "./utils/promise_utils.js";
import Code_Analyser from "./services/code_analyser.js";

const port = config.port;
const app = express();
const server = http.createServer(app);
expressWS(app, server);

app.use(cors()); // prevent cors errors
app.use(express.json());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
	})
);

app.use(passport.initialize());
app.use(passport.session());

// ----- ROUTES -----

// api
app.use("/api/v1", api_routes);

// web app
app.get("*", express.static(path.resolve(process.cwd(), "client", "build")));
app.get("*", async (req, res, next) => {
	res.sendFile(path.join(process.cwd(), "client", "build", "index.html"));
});

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

// import db from "./db/db.js";
(async () => {
	// // any startup instructions for the server
	// let code_analyser = new Code_Analyser(
	// 	"./testing/linked_list.cpp",
	// 	(event) => {
	// 		console.log(event);
	// 	}
	// );
	// code_analyser.run();
	// code_analyser.input("3");
	// console.log(
	// 	await db.users.update_user("bcd@gmail.com", {
	// 		name: "abc",
	// 		email: "abc@gmail.com",
	// 	})
	// );
	// console.log(
	// 	await db.query("UPDATE users SET name = 'def' WHERE name = 'abc';")
	// );
	// console.log(
	// 	(await db.query("SELECT * FROM users WHERE username = $1", ["se2422"]))
	// 		.rowCount
	// );
})();
