export default {
	port: 3001,
	http_codes: {
		success: 200,
		failed: 500,
	},
	testing: {
		test_user_id: "test_user",
	},
	users: {
		files: {
			root_dir_path: "_users",
		},
	},
	file_manager: {
		actions: ["create", "write", "delete"],
		entities: ["file", "dir"],
		user_statuses: {
			free_status: "__free__",
			pending_statuses: {
				reading: "__reading__",
				writing: "__writing__",
				running: "__running__",
			},
			pending_check_period: 1000,
		},
	},
};
