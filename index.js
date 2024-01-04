// RUN COMMAND:
// `node index.js <header-file-path> <code-file-path>`

// TODO:
// - create a function for receiving events and this should redirect
//   input data events to another function that would echo the input data
//   into the input named pipe file
// - set up change events
// - package into a class that should be exported and can be instantiated
//   and has an on('event', callback) function
// - conditionals like (flag ? new Node() : new Tree()) won't work
// - created objects with non-default constructors should be directly
//   created with their initialization values, instead of letting
//   those trigger change events after creation
// - deal with compilation errors

// ---------- IMPORTS ----------

import { strict as assert } from 'assert';

import { spawn } from 'node-pty';

// ---------- GLOBALS ----------

// --- CONSTANTS ---

const args = process.argv.slice(2);

const named_pipe_maintainer_bash_script_file_path = "named_pipe_maintainer.sh";

const code_header_file_path = args[0];
const code_file_path = args[1];
const code_file_name = code_file_path.substr(0, code_file_path.lastIndexOf("."));
const executable_file_path = code_file_name + ".exe";
const program_input_file_path = code_file_name + ".in";
const program_output_file_path = code_file_name + ".out";
const program_error_file_path = code_file_name + ".err";

const pseudoterminal_max_width = 999;
const pseudoterminal_options = {
  cols: pseudoterminal_max_width,
  rows: 40,
  cwd: process.cwd(),
  env: process.env,
};

const linked_list_class_name = 'Linked_list';
const node_class_name = 'Node';

// --- VARIABLES ---

// gdb child processes
let gdb_process;
let program_output_process;
let program_error_process;

// gdb promises
let command_promise;
let responce_promise;

// ---------- FUNCTION DEFINITIONS ----------

// --- UTIL FUNCTIONS ---

// sleep function
const sleep = (time) => {
	return new Promise(res => setTimeout(res, time));
};

// creates a promise that can be externally resolved
const create_externally_resolvable_promise = () => {
    let res, prom = new Promise(inner_res => {
        res = inner_res;
    });
    prom.resolve = res;
    return prom;
};

// normalize string, remove colour codes and all other ansi codes
const ansi_normalize = (str) => {
	const normalized_str = str.replace(
		/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
	return normalized_str;
}

// tokenizes a string
const tokenize = (str) => {
	// split on punctuation and symbols while preserving them
	// and split on whitespaces without preservation
	// the regex matches whitespaces or noncapturing punctuation
	// after or before with optional whitespaces around them
	return str.split(/\s+|(?:\s*(?:(?<=[^\s\w])|(?=[^\s\w]))\s*)/);
};

// count occurrences of key in an array
const count_occurrences = (arr, key) => {
	let c = 0;
	for (const ele of arr) {
		if (ele === key) {
			c++;
		}
	}
	return c;
};

// returns the index of the nth occurrence of a key in an array
const get_nth_occurrence_index = (arr, key, j) => {
	let c = -1;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === key) {
			c++;
		}

		if (c == j) {
			return i;
		}
	}
	assert(false);
	return -1;
}

// executes a bash command using a temporary pseudoterminal session
const execute_bash_command = async (command, args) => {
  return (new Promise((resolve, reject) => {
    const pty_process = spawn(
			command,
			args,
			pseudoterminal_options,
		);
    let result = '';

    pty_process.on('data', data => {
      result += data;
    });

    pty_process.on('exit', code => {
      if (code === 0) {
        resolve(result);
      } else {
				console.log(`[!!!] command {${command}} failed`);
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  }));
};

// !DEPRECATED! creates a tty instance that is hard to kill
// stop input to output echoing
const stop_input_to_output_echoing = (spawn_instance) => {
	const stdout = process.stdout;
	const tty = process.binding('tty_wrap').TTY;
	const tty_instance = new tty(spawn_instance.fd, true);
	tty_instance.setRawMode(true);
	spawn_instance.on('data', stdout.write.bind(stdout));
	process.stdin.on('data', spawn_instance.write.bind(spawn_instance));
};

// log event
const log_event = (json) => {
	console.log(json);
};

// --- HELPER FUNCTIONS ---

// executes one gdb command and returns the responce async
const execute_gdb_command = async (command) => {
	responce_promise = create_externally_resolvable_promise();
	command_promise.resolve(command);
	return await responce_promise;
};

// process incoming data from gdb stdout
const on_gdb_data = (() => {
	// closure for responce_lines
	let responce_lines = [];
	let echo = null;

	return async (data) => {
		data = ansi_normalize(data.toString()).trim();

		// split
		const delimiter = "(gdb)";
		const delimiter_escaped = "\\(gdb\\)";
		const regex = new RegExp(`(((?!(${delimiter_escaped})).)+|${delimiter_escaped})`, 'g');
		let responces_delimited = data.match(regex);
		if (responces_delimited === null) {
			responces_delimited = [];
		}

		for (const responce of responces_delimited) {
			// if responce
			if (responce !== delimiter) {
				// add to responce lines
				responce.split('\n').forEach((line, i) => {
					responce_lines.push(line.trim());
				});

			// else if delimiter
			} else {
				// remove echo
				if (echo !== null) {
					// assert echoing
					assert(echo === responce_lines[0]);
					// remove first element in array
					responce_lines.shift();
				}

				// process responce and get next command
				command_promise = create_externally_resolvable_promise();
				responce_promise.resolve(responce_lines);
				const command = await command_promise;

				// send command
				gdb_process.write(command + '\n');
				echo = command;

				// reset responce_lines
				responce_lines = [];
			}
		}
	};
})();

// process incoming program output data
const on_program_output_data = (data) => {
	log_event({
		type: "output",
		text: data,
	});
};

// process incoming program error data
const on_program_error_data = (data) => {
	log_event({
		type: "error",
		text: data,
	});
};

// checks if responce is from a controlpoint
const is_controlpoint = (res) => {
	const tokens = tokenize(res[0]);
	if (
		tokens[0].toLowerCase() === 'breakpoint' ||
		(tokens[0] + ' ' + tokens[1]).toLowerCase() === 'hardware watchpoint'
	) {
		return true;
	}
	return false;
};

// get controlpoint number
const get_controlpoint_number = (res) => {
	const tokens = tokenize(res[0]);
	if (tokens[0].toLowerCase() === 'breakpoint') {
		return parseInt(tokens[1]);
	} else if (
		(tokens[0] + ' ' + tokens[1]).toLowerCase() === 'hardware watchpoint'
	) {
		return parseInt(tokens[2]);
	}
	console.log("[!!!] COULDN'T EXTRACT CONTROLPOINT NUMBER");
	assert(false);
	return -1;
};

// get watchpoint old value
const get_watchpoint_old_value = (res) => {
	const line = tokenize(res[1]);
	return line[line.length - 1];
}

// get watchpoint new value
const get_watchpoint_new_value = (res) => {
	const line = tokenize(res[2]);
	return line[line.length - 1];
}

// controlpoints callbacks getter and setter
const {get_controlpoint_callback, set_controlpoint_callback} = (() => {
	const controlpoints_callbacks = {};

	return {
		get_controlpoint_callback: (controlpoint) => {
			return controlpoints_callbacks[controlpoint];
		},
		set_controlpoint_callback: (controlpoint, callback) => {
			controlpoints_callbacks[controlpoint] = callback;
		},
	};
})();

// event cursor mover and getter
const {move_event_cursor, get_event_cursor_index} = (() => {
	// closure
	let current_controlpoint_line_number = 0;
	let current_controlpoint_events_indices = {
		"new": 0, "delete": 0,
	};

	return {
		// moves the event cursor to a new line number
		move_event_cursor: (line_number, line, event) => {
			const line_event_count = count_occurrences(line, event);
			if (current_controlpoint_line_number !== line_number) {
				// update to new line number
				current_controlpoint_line_number = line_number;
				// reset all event indices
				for (let event in current_controlpoint_events_indices) {
					current_controlpoint_events_indices[event] = -1;
				}
			}
			current_controlpoint_events_indices[event] += 1;
			current_controlpoint_events_indices[event] %= line_event_count;
		},

		// get current event index in line
		get_event_cursor_index: (line_number, line, event) => {
			const n = current_controlpoint_events_indices[event];
			const event_index = get_nth_occurrence_index(line, event, n);
			assert(event_index !== -1);
			return event_index;
		},
	};
})();

// events callbacks dictionary
const events_callbacks = {
	// callback for object creations
	"new": async (res) => {
		const event = "new";

		// get line info
		res = await execute_gdb_command('frame 1');
		const line_number = parseInt(tokenize(res[1])[0]);
		const line = tokenize(res[1]).slice(1);
		await execute_gdb_command('frame 0');

		// move event cursor to new position
		move_event_cursor(line_number, line, event);

		// get class name
		const event_index = get_event_cursor_index(line_number, line, event);
		assert(event_index >= 0 && event_index + 1 < line.length);
		const class_name = line[event_index + 1];

		// get address
		res = await execute_gdb_command('watch ptr');
		const watchpoint = get_controlpoint_number(res);
		res = await execute_gdb_command('continue'); res.splice(0, 1);
		assert(watchpoint === get_controlpoint_number(res));
		await execute_gdb_command(`delete ${watchpoint}`);
		const address = get_watchpoint_new_value(res);

		// TODO: this should go to a general function that can
		// then deal with all object creations

		// TODO: create watchpoints on tracked object variables

		// log event
		log_event({
			type: 'new',
			objects: [{
				class: class_name,
				location: 'heap', // HARDCODED
				id: address,
				// ...default_parameters, // TODO: pass object parameters
			}],
		});
	},

	// callback for deletions
	"delete": async (res) => {
		// get address
		res = await execute_gdb_command('watch ptr');
		const watchpoint = get_controlpoint_number(res);
		res = await execute_gdb_command('continue'); res.splice(0, 1);
		assert(watchpoint === get_controlpoint_number(res));
		await execute_gdb_command(`delete ${watchpoint}`);
		const address = get_watchpoint_new_value(res);

		// log event
		log_event({
			type: 'delete',
			id: address,
		});
	},

	"change": async (res) => {
		// TODO
	},
};

// --- MAIN FUNCTIONS ---

// intialize gdb
const initialize_gdb = async () => {
	// initialize gdb variables
	command_promise = create_externally_resolvable_promise();
	responce_promise = create_externally_resolvable_promise();

	// reset files
	await execute_bash_command(`rm`, [`-f`, `${executable_file_path}`]); // remove previous executable file
	await execute_bash_command(`rm`, [`-f`, `${program_input_file_path}`]); // remove previous program input file
	await execute_bash_command(`mkfifo`, [`${program_input_file_path}`]); // create new program input file
	await execute_bash_command(`truncate`, [`-s`, `0`, `${program_output_file_path}`]); // empty program output file
	await execute_bash_command(`truncate`, [`-s`, `0`, `${program_error_file_path}`]); // empty program error file

	// compile code
	await execute_bash_command(`g++`, [
		`-g`, `${code_header_file_path}`, `${code_file_path}`, `-o`, `${executable_file_path}`
	]);
	console.error(`[*] compiled`);

	// maintain the input named pipe opened
	const program_input_named_pipe_maintainer_process = spawn('bash',
		[`${named_pipe_maintainer_bash_script_file_path}`, `${program_input_file_path}`],
		pseudoterminal_options,
	);

	// run code
	console.error(`[*] running...`);
	gdb_process = spawn('gdb', ['-q', `${executable_file_path}`], pseudoterminal_options);
	program_output_process = spawn('tail', ['-f', `${program_output_file_path}`], pseudoterminal_options);
	program_error_process = spawn('tail', ['-f', `${program_error_file_path}`], pseudoterminal_options);

	// encoding
	gdb_process.setEncoding('utf8');
	program_output_process.setEncoding('utf8');
	program_error_process.setEncoding('utf8');

	// data callbacks
	gdb_process.on('data', on_gdb_data);
	program_output_process.on('data', on_program_output_data);
	program_error_process.on('data', on_program_error_data);

	// exit
	gdb_process.on('exit', code => {
		// kill program input, output and error processes
		program_input_named_pipe_maintainer_process.kill();
		program_output_process.kill();
		program_error_process.kill();
		console.error(`[*] code execution done with exit code ${code}`);
	});
};

// run gdb program
const run_gdb_program = async () => {
	// local variables
	let responce = undefined;

	// wait for gdb startup
	await responce_promise;

	// TESTING, TODO: remove this
	// await execute_gdb_command('');

	// create breakpoints
	responce = await execute_gdb_command('break operator new'); console.error(responce);
	set_controlpoint_callback(get_controlpoint_number(responce), events_callbacks["new"]);
	responce = await execute_gdb_command('break operator delete(void*)'); console.error(responce);
	set_controlpoint_callback(get_controlpoint_number(responce), events_callbacks["delete"]);

	// !DEPRECATED! analyse node class
	// responce = await execute_gdb_command(`ptype ${node_class_name}`); console.error(responce);

	// run program
	responce = await execute_gdb_command(`run < ${program_input_file_path} 1> ${program_output_file_path} 2> ${program_error_file_path}`);
	responce.splice(0, 1); // remove starting line
	console.error(responce);

	while (is_controlpoint(responce)) {
		const controlpoint_callback = get_controlpoint_callback(get_controlpoint_number(responce));
		await controlpoint_callback(responce);
		
		// get next responce
		responce = await execute_gdb_command('continue');
		responce.splice(0, 1); // remove starting line
		console.error(responce);
	}

	// quit
	await execute_gdb_command('quit');
};

// ---------- MAIN PROGRAM ----------

(async () => {
	await initialize_gdb();
	run_gdb_program();
})();
