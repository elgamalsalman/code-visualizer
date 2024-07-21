import {
	run_event_statuses,
	run_event_types,
} from "../../../models/run_event_models.js";
import Code_Analyser from "../../../services/code_analyser.js";

class WS_Run_Controller {
	// ----- CONSTRUCTORS -----

	constructor() {
		// just an empty constructor
	}

	// ----- MEMBER FUNCTIONS -----

	// --- PRIVATE ---

	#process_user_event = async (code_analyser, event) => {
		if (event.type === run_event_types.stdin) {
			code_analyser.input(event.data);
		} else {
			console.log("Unknown run_event received from browser");
			console.log(event);
		}
	};

	// --- PUBLIC ---

	run = async (ws, req) => {
		const { user_id } = req.body;
		console.log(`ws_run() from ${user_id}`);

		let code_analyser = new Code_Analyser(user_id, (event) => {
			ws.send(JSON.stringify(event));
		});

		// recieve events
		ws.on("message", (payload) => {
			const event = JSON.parse(payload);
			this.#process_user_event(code_analyser, event);
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
}

const ws_run_controller = new WS_Run_Controller();

export default ws_run_controller;
