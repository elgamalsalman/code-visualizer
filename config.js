export default {
	port: 3001,
	root_dir_path: process.cwd(),
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
			executable_file_name: ".exe",
			program_input_file_name: ".in",
			program_output_file_name: ".out",
			program_error_file_name: ".err",
			shared: {
				makefile: {
					path: "scripts/makefile",
					name: "makefile",
				},
				code_header: {
					path: "scripts/code_header.cpp",
				},
				named_pipe_maintainer: {
					path: "scripts/named_pipe_maintainer.sh",
				},
			},
		},
	},
	file_manager: {
		eventTypes: ["create", "write", "delete"],
		entityTypes: ["file", "dir"],
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
	code_analyser: {
		events: {
			input: "input",
			output: "output",
			error: "error",
		},
		events_templates: {
			input: {
				type: "input",
				content: "the inputted text",
			},
		},
	},
};
