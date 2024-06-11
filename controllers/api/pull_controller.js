import config from "../../config.js";

import File_Manager from "../../services/file_manager.js";

class Pull_Controller {
	#file_manager = new File_Manager();

	constructor() {
		// empty constructor
	}

	pull = async (req, res, next) => {
		// --- REQUEST BODY STRUCTURE ---
		// {
		// 	user_id: "test_user",
		// }
		// RETURN: [
		//  { path, type }
		// ]
		// TODO: change return to { file_tree: {} }

		const { user_id } = req.body;
		console.log(`sending file tree to user`);
		try {
			const file_tree = await this.#file_manager.get_user_file_tree(user_id);

			const file_response = {
				status: config.http_codes.success,
				file_tree: file_tree,
			};

			res.send(JSON.stringify(file_response));
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
			console.log(error_response);
		}
	};
}

const pull_controller = new Pull_Controller();

export default pull_controller;
