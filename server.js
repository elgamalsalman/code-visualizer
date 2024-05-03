import path from "path";
import http from "http";

import express from "express";
import { WebSocketServer } from "ws";

import Code_Analyser from "./controllers/code_analyser.js";
import { sleep } from "./utils/promise_utils.js";

const port = 3001;
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.get("/LOG", (request, response, next) => {
	const { building, type, number, state } = request.query;
	console.log({ building, type, number, state });
	response.status(404).send("Data recieved, no page will be provided.");
});

app.use("/", express.static(path.resolve(process.cwd(), "client", "build")));

// ----- API -----

app.use("/api", (request, response, next) => {
	response.send({
		message: "Data from API!",
	});
});

// ----- ROUTES -----

app.get("/", (request, response, next) => {
	response.sendFile(path.join(process.cwd(), "client", "build", "index.html"));
});

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

(async () => {
	// any startup instructions for the server
	let code_analyser = new Code_Analyser(
		"./testing/linked_list.cpp",
		(event) => {
			console.log(event);
		}
	);
	code_analyser.run();
	code_analyser.input("3");
})();
