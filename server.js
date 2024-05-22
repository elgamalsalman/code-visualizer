import path from "path";
import http from "http";

import express from "express";
import cors from "cors";
import expressWS from "express-ws";

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

app.use("/", express.static(path.resolve(process.cwd(), "client", "build")));

// ----- ROUTES -----

// api
app.use("/api/v1", api_routes);

// web app
app.get("/", async (req, res, next) => {
	res.sendFile(path.join(process.cwd(), "client", "build", "index.html"));
});

server.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

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
})();
