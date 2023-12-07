// TODO:
// - pipe output of code itself to a different place

// ---------- IMPORTS ----------

import { spawn, execSync, exec } from 'child_process';

// ---------- GLOBALS ----------

// --- CONSTANTS ---

const args = process.argv.slice(2);

const code_header_file_path = args[0];
const code_file_path = args[1];
const executable_file_path = code_file_path.substr(0, code_file_path.lastIndexOf(".")) + ".out";

const linked_list_class_name = 'Linked_list';
const node_class_name = 'Node';

// --- VARIABLES ---

// gdb child process
let gdb;

// gdb promises
let command_promise;
let responce_promise;

// ---------- FUNCTION DEFINITIONS ----------

// --- UTIL FUNCTIONS ---

// sleep function
const sleep = (time) => {
	return new Promise(res => setTimeout(res, time));
};

// gets word by index from string TODO
const get_word_by_index = (str, index) => {
	console.log(str.split().filter(Boolean));
};

// creates a promise that can be externally resolved
const create_externally_resolvable_promise = () => {
    let res, prom = new Promise(inner_res => {
        res = inner_res;
    });
    prom.resolve = res;
    return prom;
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

	// return the real on_gdb_data function
	return async data => {
		data = data.toString().trim();

		// split
		const delimiter = "(gdb)";
		const delimiter_escaped = "\\(gdb\\)";
		const regex = new RegExp(`(((?!(${delimiter_escaped})).)+|${delimiter_escaped})`, 'g');
		const responces_delimited = data.match(regex);

		let responces = data.split('(gdb)');
		for (const responce of responces_delimited) {
			// if responce
			if (responce != delimiter) {
				// add to responce lines
				responce.split('\n').forEach((line, i) => {
					responce_lines.push(line.trim());
				});

			// else if delimiter
			} else {
				// process responce and get next command
				command_promise = create_externally_resolvable_promise();
				responce_promise.resolve(responce_lines);
				const command = await command_promise;

				// send command
				gdb.stdin.write(command + '\n');

				// reset responce_lines
				responce_lines = [];
			}
		}
	}
})();

// check if breakpoint
const is_breakpoint = (res) => {
	// TODO
	return true;
};

// get breakpoint number
const get_controlpoint_number = (res) => {
	// TODO
	return 0;
};

// --- MAIN FUNCTIONS ---

// intialize gdb
const initialize_gdb = async () => {
	// initialize gdb variables
	command_promise = create_externally_resolvable_promise();
	responce_promise = create_externally_resolvable_promise();

	// compile and run code
	execSync(`g++ -g ${code_header_file_path} ${code_file_path} -o ${executable_file_path}`);
	gdb = spawn('gdb', ['-q', `${executable_file_path}`], { stdio: ['pipe', 'pipe', 'pipe'] });
	gdb.stdout.setEncoding('utf8');

	gdb.stdout.on('data', on_gdb_data);

	gdb.stderr.on('data', async (data) => {
		console.error(`stderr: ${data}`);
	});

	gdb.on('close', async (code) => {
		console.log(`child process exited with code ${code}`);
	});
};

// run gdb program
const run_gdb_program = async () => {
	// local variables
	let responce = undefined;
	const breakpoints_functions = {};
	const breakpoints_functions_callbacks = {
		"new": async res => {
			// TODO
			responce = await execute_gdb_command('watch ptr'); console.log(responce);
			const watchpoint = get_controlpoint_number(responce);
			responce = await execute_gdb_command('continue ptr'); responce.splice(0, 1);
			console.log(responce);
			responce = await execute_gdb_command(`delete ${watchpoint}`); console.log(responce);
		},

		"delete": async res => {
			// TODO
		},
	};

	// wait for gdb startup
	await responce_promise;

	// create breakpoints
	responce = await execute_gdb_command('break operator new'); console.log(responce);
	breakpoints_functions[get_controlpoint_number(responce)] = "new";
	responce = await execute_gdb_command('break operator delete'); console.log(responce);
	breakpoints_functions[get_controlpoint_number(responce)] = "delete";

	// analyse node class
	// responce = await execute_gdb_command(`ptype ${node_class_name}`); console.log(responce);

	// run program
	responce = await execute_gdb_command('run'); responce.splice(0, 1);
	console.log(responce);
	if (is_breakpoint(responce)) {
		const func = breakpoints_functions[get_controlpoint_number(responce)];
		await breakpoints_functions_callbacks[func](responce);
	} else if (is_watchpoint(responce)) {
		// TODO
	}

	// quit
	execute_gdb_command('quit');
};

// ---------- MAIN PROGRAM ----------

(async () => {
	await initialize_gdb();
	run_gdb_program();
})();
