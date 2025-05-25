import config from "../../config.js";

import File_Manager from "../../services/file_manager.js";

class Pull_Controller {
	#file_manager = new File_Manager();

	constructor() {
		// empty constructor
	}

	file_tree = async (req, res, next) => {
		// --- REQUEST BODY STRUCTURE ---
		// {}
		// RETURN: { file_tree: {} }

		const { user_id } = req.auth;
		console.log("sending file tree of user:", user_id);
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

	entities = async (req, res, next) => {
		// --- REQUEST BODY STRUCTURE ---
		// {
		// 	user_id: "test_user",
		//	entity_metas: [],
		// }
		// RETURN: [entity1, ...]

		const { user_id, entity_metas } = req.body;
		console.log(`sending entity to user`);
		try {
			const entities = await this.#file_manager.get_user_entities(
				user_id,
				entity_metas
			);

			const file_response = {
				status: config.http_codes.success,
				entities: entities,
			};
			console.log(entities);

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
