import config from "../config.js";

import file_manager from "../services/file_manager.js";

const push_events = async (req, res, next) => {
	// --- REQUEST BODY STRUCTURE ---
	// {
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

	const { user_id } = req.auth;
	const { events } = req.body;
	console.log(`user ${user_id} saving files...`);
	try {
		await file_manager.update_user_files(user_id, events);

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

const pull_file_tree = async (req, res, next) => {
	const { user_id } = req.auth;
	console.log("sending file tree of user:", user_id);
	try {
		const file_tree = await file_manager.get_user_file_tree(user_id);
		res.status(config.http_codes.success).json(file_tree);
	} catch (err) {
		next({
			status: err.status || config.http_codes.failed,
			message: error.message || "failed to load user file tree",
		});
	}
};

const pull_entities = async (req, res, next) => {
	const { user_id } = req.auth;
	const { entity_metas } = req.body;
	try {
		const entities = await file_manager.get_user_entities(
			user_id,
			entity_metas
		);
		res.status(config.http_codes.success).send(entities);
	} catch (error) {
		next({
			status: err.status || config.http_codes.failed,
			message: error.message || "failed to load entities",
		});
	}
};

const entity_controller = { push_events, pull_file_tree, pull_entities };

export default entity_controller;
