import config from "../../config.js";

import File_Manager from "../../services/file_manager.js";

class Push_Controller {
	#file_manager = new File_Manager();

	constructor() {
		// empty constructor
	}

	push = async (req, res, next) => {
		// --- REQUEST BODY STRUCTURE ---
		// {
		// 	user_id: "test_user",
		// 	events: [
		// 		{
		// 			type: "create"/"write"/"delete",
		// 			entity: {
		// 				path: "main.cpp",
		// 				type: "file"/"dir",
		// 				content: "// content of main.cpp!",
		// 			},
		// 		},
		// 	],
		// }

		const { user_id, events } = req.body;
		console.log(`user ${user_id} saving files...`);
		try {
			await this.#file_manager.update_user_files(user_id, events);

			res.send(
				JSON.stringify({
					status: config.http_codes.success,
				})
			);
		} catch (error) {
			const error_response = {
				status: config.http_codes.failed,
				error: {
					name: error.name,
					message: error.message,
					stack: error.stack,
				},
			};
			res.send(JSON.stringify(error_response));
			console.error(error_response);
		}
	};
}

const push_controller = new Push_Controller();

export default push_controller;
