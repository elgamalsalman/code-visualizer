import config from "../../../config.js";

import Code_Analyser from "../../../services/code_analyser.js";

class WS_Run_Controller {
	// ----- CONSTRUCTORS -----

	constructor() {
		// just an empty constructor
	}

	// ----- MEMBER FUNCTIONS -----

	// --- PRIVATE ---

	#process_user_event = async (code_analyser, event) => {
		if (event === config.code_analyser.events.input) {
			code_analyser.input(event.text);
		}
	};

	// --- PUBLIC ---

	run = async (ws, req) => {
		const { user_id } = req.body;

		let code_analyser = new Code_Analyser(user_id, (event) => {
			ws.send(JSON.stringify(event));
		});

		// recieve events
		ws.on("message", (event) => {
			this.#process_user_event(code_analyser, event);
		});

		// compile and run
		const res = await code_analyser.init();
		if (res.status === "success") {
			await code_analyser.run();
		}

		// end connection
		ws.close();
	};
}

const ws_run_controller = new WS_Run_Controller();

export default ws_run_controller;
