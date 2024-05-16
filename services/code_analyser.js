// ---------- IMPORTS ----------

// ----- EXTERNAL -----

import { strict as assert } from "assert";

// ----- INTERNAL -----

// utils
import { create_externally_resolvable_promise } from "../utils/promise_utils.js";
import {
	count_occurrences,
	get_nth_occurrence_index,
} from "../utils/container_utils.js";
import { tokenize } from "../utils/string_utils.js";

// controllers
import PTY from "./pty.js";
import GDB from "./gdb.js";

// TODO put this in a config file
// ---------- CONFIG ----------

const CODE_HEADER_FILE_PATH = "./scripts/code_header.cpp";
const NAMED_PIPE_MAINTAINER_BASH_SCRIPT_FILE_PATH =
	"./scripts/named_pipe_maintainer.sh";
const EXECUTABLE_FILE_EXTENSION = "exe";
const INPUT_FILE_EXTENSION = "in";
const OUTPUT_FILE_EXTENSION = "out";
const ERROR_FILE_EXTENSION = "err";

// tracked class structures
let CLASSES = {
	Node: {
		properties: [
			{ name: "next", type: "Node*" },
			{ name: "value", type: "int" },
		],
	},
	Linked_list: {
		properties: [],
	},
};

// ---------- CLASS ----------

class Code_Analyser {
	// ----- MEMBER VARIABLES -----

	// code header
	#code_header_file_path;
	#code_file_path;
	#code_file_name;
	#executable_file_path;
	#program_input_file_path;
	#program_output_file_path;
	#program_error_file_path;

	// promises
	#init_promise;

	// processes
	#gdb;
	#program_output_process;
	#program_error_process;

	// events handler
	#events_handler;

	// callbacks data
	#controlpoints_callbacks = {};

	// program memory data
	#tracked_objects_set = new Set();
	#tracked_objects_controlpoints = {};

	// cursor data
	#current_controlpoint_line_number = 0;
	#current_controlpoint_events_indices = {
		new: 0,
		delete: 0,
	};

	// events callbacks dictionary
	#events_callbacks = {
		// callback for object creations
		new: async (res) => {
			const event = "new";

			// get line info
			res = await this.#gdb.execute("frame 1");
			const line_number = parseInt(tokenize(res[1])[0]);
			const line = tokenize(res[1]).slice(1);
			await this.#gdb.execute("frame 0");

			// move event cursor to new position
			this.#move_event_cursor(line_number, line, event);

			// get class name
			const event_index = this.#get_event_cursor_index(
				line_number,
				line,
				event
			);
			assert(event_index >= 0 && event_index + 1 < line.length);
			const class_name = line[event_index + 1];

			// if this class is tracked
			if (class_name in CLASSES) {
				// get object address
				const ptr_address = await this.#gdb.get_variable_address("ptr");
				res = await this.#gdb.execute(`watch ptr`);
				const watchpoint = GDB.get_controlpoint_number(res);
				res = await this.#gdb.execute("continue");
				res.splice(0, 1);
				console.error(res);
				assert(watchpoint === GDB.get_controlpoint_number(res));
				await this.#gdb.execute(`delete ${watchpoint}`);
				const object_address = await this.#gdb.examine_pointed_value(
					ptr_address,
					"a"
				);

				// track object
				this.#track_object(object_address);

				// setup watchpoints on all tracked properties
				for (const { name: property_name, type: property_type } of CLASSES[
					class_name
				].properties) {
					// get property address
					const property_address = await this.#gdb.get_variable_address(
						`((${class_name}*)(${object_address})).${property_name}`
					);

					// setup a watchpoint
					res = await this.#gdb.execute(
						`watch (${property_type})(*(${property_address}))`
					);
					const watchpoint = GDB.get_controlpoint_number(res);
					const callback = this.#events_callbacks["change"](
						object_address,
						property_name,
						property_address,
						property_type
					);
					this.#set_controlpoint_callback(watchpoint, callback);
					this.#add_tracked_object_controlpoint(object_address, watchpoint);
				}

				// log event
				this.#log_event({
					type: "new",
					objects: [
						{
							class: class_name,
							location: "heap", // HARDCODED
							id: object_address,
							// ...default_parameters, // TODO: pass object parameters
						},
					],
				});
			}
		},

		// callback for deletions
		delete: async (res) => {
			// get address
			const ptr_address = await this.#gdb.get_variable_address("ptr");
			res = await this.#gdb.execute("watch ptr");
			const watchpoint = GDB.get_controlpoint_number(res);
			res = await this.#gdb.execute("continue");
			res.splice(0, 1);
			assert(watchpoint === GDB.get_controlpoint_number(res));
			await this.#gdb.execute(`delete ${watchpoint}`);
			const object_address = await this.#gdb.examine_pointed_value(
				ptr_address,
				"a"
			);

			// TODO: do not consider all deletions, only tracked classes
			await this.#untrack_object(object_address);

			// log event
			this.#log_event({
				type: "delete",
				id: object_address,
			});
		},

		// returns a callback for the change of a specific property in a
		// specific object, takes id and property name and returns callback
		change: (
			object_address,
			property_name,
			property_address,
			property_type
		) => {
			return async (res) => {
				// TODO: this should be changed later for better type based callback choosing

				let examination_format = null;
				// if the property holds addresses
				if (property_type[property_type.length - 1] === "*") {
					examination_format = "a";
					// otherwise
				} else {
					examination_format = "d";
				}

				const new_value = await this.#gdb.examine_pointed_value(
					property_address,
					examination_format
				);

				this.#log_event({
					type: "change",
					id: object_address,
					property: property_name,
					new_value: new_value,
				});
			};
		},
	};

	// ----- CONSTRUCTORS -----

	constructor(code_file_path, events_handler) {
		this.#code_header_file_path = CODE_HEADER_FILE_PATH;
		this.#code_file_path = code_file_path;
		this.#code_file_name = code_file_path.substr(
			0,
			code_file_path.lastIndexOf(".")
		);
		this.#executable_file_path =
			this.#code_file_name + "." + EXECUTABLE_FILE_EXTENSION;
		this.#program_input_file_path =
			this.#code_file_name + "." + INPUT_FILE_EXTENSION;
		this.#program_output_file_path =
			this.#code_file_name + "." + OUTPUT_FILE_EXTENSION;
		this.#program_error_file_path =
			this.#code_file_name + "." + ERROR_FILE_EXTENSION;
		this.#init_promise = create_externally_resolvable_promise();

		this.#events_handler = events_handler;

		// async
		this.#init();
	}

	// ----- MEMBER FUNCTIONS -----

	// --- PRIVATE ---

	// log event // TODO send it
	#log_event = (json) => {
		// console.log(json);
		this.#events_handler(json);
	};

	// process incoming program output data
	#on_program_output_data = (data) => {
		this.#log_event({
			type: "output",
			text: data,
		});
	};

	// process incoming program error data
	#on_program_error_data = (data) => {
		this.#log_event({
			type: "error",
			text: data,
		});
	};

	// controlpoints callbacks getter and setter
	#get_controlpoint_callback = (controlpoint) => {
		return this.#controlpoints_callbacks[controlpoint];
	};
	#set_controlpoint_callback = (controlpoint, callback) => {
		this.#controlpoints_callbacks[controlpoint] = callback;
	};

	// tracking objects and their controlpoints
	#track_object = (object_id) => {
		this.#tracked_objects_set.add(object_id);
		this.#tracked_objects_controlpoints[object_id] = [];
	};
	#add_tracked_object_controlpoint = (object_id, controlpoint) => {
		// assert that the object is tracked
		assert(
			this.#tracked_objects_set.has(object_id) &&
				object_id in this.#tracked_objects_controlpoints
		);
		// track controlpoint
		this.#tracked_objects_controlpoints[object_id].push(controlpoint);
	};
	#untrack_object = async (object_id) => {
		// untrack controlpoints
		for (const watchpoint of this.#tracked_objects_controlpoints[object_id]) {
			await this.#gdb.execute(`delete ${watchpoint}`);
		}
		delete this.#tracked_objects_controlpoints[object_id];
		// untrack object
		this.#tracked_objects_set.delete(object_id);
	};

	// moves the event cursor to a new line number
	#move_event_cursor = (line_number, line, event) => {
		const line_event_count = count_occurrences(line, event);
		if (this.#current_controlpoint_line_number !== line_number) {
			// update to new line number
			this.#current_controlpoint_line_number = line_number;
			// reset all event indices
			for (let event in this.#current_controlpoint_events_indices) {
				this.#current_controlpoint_events_indices[event] = -1;
			}
		}
		this.#current_controlpoint_events_indices[event] += 1;
		this.#current_controlpoint_events_indices[event] %= line_event_count;
	};

	// get current event index in line
	#get_event_cursor_index = (line_number, line, event) => {
		const n = this.#current_controlpoint_events_indices[event];
		const event_index = get_nth_occurrence_index(line, event, n);
		assert(event_index !== -1);
		return event_index;
	};

	// intialise gdb
	#init = async () => {
		// reset files
		await PTY.execute(`rm`, [`-f`, `${this.#executable_file_path}`]); // remove previous executable file
		await PTY.execute(`rm`, [`-f`, `${this.#program_input_file_path}`]); // remove previous program input file
		await PTY.execute(`mkfifo`, [`${this.#program_input_file_path}`]); // create new program input file
		await PTY.execute(`truncate`, [
			`-s`,
			`0`,
			`${this.#program_output_file_path}`,
		]); // empty program output file
		await PTY.execute(`truncate`, [
			`-s`,
			`0`,
			`${this.#program_error_file_path}`,
		]); // empty program error file

		// compile code
		await PTY.execute(`g++`, [
			`-g`,
			`${this.#code_header_file_path}`,
			`${this.#code_file_path}`,
			`-o`,
			`${this.#executable_file_path}`,
		]);
		console.error(`[*] compiled`);

		// maintain the input named pipe opened
		const program_input_named_pipe_maintainer_process = new PTY("bash", [
			`${NAMED_PIPE_MAINTAINER_BASH_SCRIPT_FILE_PATH}`,
			`${this.#program_input_file_path}`,
		]);

		// run code
		console.error(`[*] running...`);
		this.#gdb = new GDB(["-q", `${this.#executable_file_path}`]);
		this.#program_output_process = new PTY("tail", [
			"-f",
			`${this.#program_output_file_path}`,
		]);
		this.#program_error_process = new PTY("tail", [
			"-f",
			`${this.#program_error_file_path}`,
		]);

		// data callbacks
		this.#program_output_process.on("data", this.#on_program_output_data);
		this.#program_error_process.on("data", this.#on_program_error_data);

		// exit
		this.#gdb.on("exit", (code) => {
			// kill program input, output and error processes
			program_input_named_pipe_maintainer_process.kill();
			this.#program_output_process.kill();
			this.#program_error_process.kill();
			console.error(`[*] code execution done with exit code ${code}`);
		});

		// resolve initialization promise
		this.#init_promise.resolve();
	};

	// --- PUBLIC ---

	// run program
	run = async () => {
		// wait for initialisation
		await this.#init_promise;

		// local variables
		let res = undefined;

		// allow for unlimited number of watchpoints
		await this.#gdb.execute("set can-use-hw-watchpoints 0");

		// create breakpoints
		res = await this.#gdb.execute("break operator new");
		console.error(res);
		this.#set_controlpoint_callback(
			GDB.get_controlpoint_number(res),
			this.#events_callbacks["new"]
		);
		res = await this.#gdb.execute("break operator delete(void*)");
		console.error(res);
		this.#set_controlpoint_callback(
			GDB.get_controlpoint_number(res),
			this.#events_callbacks["delete"]
		);

		// run program
		res = await this.#gdb.execute(
			`run < ${this.#program_input_file_path} 1> ${
				this.#program_output_file_path
			} 2> ${this.#program_error_file_path}`
		);
		res.splice(0, 1); // remove starting line
		console.error(res);

		while (GDB.is_controlpoint(res)) {
			const controlpoint_callback = this.#get_controlpoint_callback(
				GDB.get_controlpoint_number(res)
			);
			await controlpoint_callback(res);

			// get next responce
			res = await this.#gdb.execute("continue");
			res.splice(0, 1); // remove starting line
			console.error(res);
		}

		// list watchpoints
		await this.#gdb.execute("info watchpoints");

		// quit
		await this.#gdb.execute("quit");
	};

	// take user input
	input = async (str) => {
		// wait for initialisation
		await this.#init_promise;

		// pass program input to input's named pipe
		const bash_process = new PTY(`bash`, []);
		bash_process.write(`echo '${str}' > ${this.#program_input_file_path}\r`);
		bash_process.write(`exit\r`);
	};
}

// ---------- EXPORTS ----------

export default Code_Analyser;
