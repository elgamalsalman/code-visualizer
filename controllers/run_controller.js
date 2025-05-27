import Code_Analyser from "../services/code_analyser.js";

import {
	run_event_statuses,
	run_event_types,
} from "../models/run_event_models.js";

const run = async (ws, req) => {
	const { user_id } = req.auth;

	let code_analyser = new Code_Analyser(user_id, (event) => {
		ws.send(JSON.stringify(event));
	});

	// recieve events
	ws.on("message", (payload) => {
		const event = JSON.parse(payload);

		if (event.type === run_event_types.stdin) {
			code_analyser.input(event.data);
		} else {
			console.log("Unknown run_event received from browser");
			console.log(event);
		}
	});

	// compile and run
	const compilation_event = await code_analyser.init();
	if (compilation_event.status === run_event_statuses.success) {
		await code_analyser.run();
		console.log("done running!");
	}

	// end connection
	ws.close();
};

const run_controller = { run };

export default run_controller;
