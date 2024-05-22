import config from "../../config.js";

import File_Manager from "../../services/file_manager.js";

export default class Save_Controller {
	#file_manager = new File_Manager(config.users.files.root_dir_path);

	constructor() {
		// empty constructor
	}

	save = async (req, res, next) => {
		// --- REQUEST BODY STRUCTURE ---
		// {
		// 	user_id: "test_user",
		// 	updates: [
		// 		{
		// 			action: "create"/"write"/"delete",
		// 			path: "main.cpp",
		// 			entity: "file"/"dir",
		// 			content: "// content of main.cpp!",
		// 		},
		// 	],
		// }

		const { user_id, updates } = req.body;
		console.log(`user ${user_id} saving files...`);
		try {
			await this.#file_manager.update_user_files(user_id, updates);

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
