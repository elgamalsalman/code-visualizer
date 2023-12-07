// TODO:
// - pipe output of code itself to a different place

// ---------- IMPORTS ----------

import { spawn, execSync, exec } from 'child_process';

// ---------- GLOBALS ----------

const args = process.argv.slice(2);

const code_header_file_path = args[0];
const code_file_path = args[1];
const executable_file_path = code_file_path.substr(0, code_file_path.lastIndexOf(".")) + ".out";

const linked_list_class_name = 'Linked_list';
const node_class_name = 'Node';
let node_class_analysis = undefined;

// ---------- FUNCTION DECLARATIONS ----------

let empty_callback;
let node_class_analysis_callback;
let run_callback;
let breakpoint_callback;
let watchpoint_callback;
let new_callback;
let new_arr_callback;
let delete_callback;
let delete_arr_callback;

// ---------- GDB COMMANDS ----------

// starting gdb commands
let command_index = 0;
let responce_callback = empty_callback;
let command_callback_pairs = [{
		command: 'break operator new',
		callback:	empty_callback,
	}, {
		command: 'break operator new[]',
		callback:	empty_callback,
	}, {
		command: 'break operator delete',
		callback:	empty_callback,
	}, {
		command: 'break operator delete[]',
		callback:	empty_callback,
	}, {
		command: 'ptype Node',
		callback:	node_class_analysis_callback,
	}, {
		command: 'run',
		callback:	run_callback,
}];

// ---------- FUNCTION DEFINITIONS ----------

// --- HELPER FUNCTIONS ---

// gets word by index from string TODO
const get_word_by_index = (str, index) => {
	console.log(str.split().filter(Boolean));
};

// processes a responce
const process_responce = (responce) => {
	// debug responce
	console.log(`// responce: <START OF RESPONCE>`);
	for (let responce_line of responce) {
		console.log(`// ${responce_line}`);
	}
	console.log(`// <END OF RESPONCE>`);

	// process data
	responce_callback(responce);

	// next command
	let { command, callback } = command_callback_pairs[command_index];
	command_index++;

	console.log(`// command: ${command}`);
	gdb.stdin.write(command + '\n');
	responce_callback = callback;
};

// --- GDB CALLBACKS ---

empty_callback = _ => {};

node_class_analysis_callback = (responce) => {};

run_callback = (responce) => {
	// remove first two continuation lines
	responce.splice(0, 2);
	// pass to breakpoint callback
	breakpoint_callback(responce);
};

breakpoint_callback = (responce) => {
	// get breakpoint or watchpoint line index
	let breakpoint_line_index = -1;
	let watchpoint_line_index = -1;
	for (const i in responce) {
		const line = responce[i];
		if (line.includes("Breakpoint")) {
			breakpoint_line_index = i;
		} else if (line.includes("watchpoint")) {
			watchpoint_line_index = i;
		}
	}

	// breakpoint triggered
	if (breakpoint_line_index !== -1) {
		breakpoint_number = get_word_by_index(responce[breakpoint_line_index], 2).slice(0, -1);
		breakpoint_number = parseInt(breakpoint_number);

		// which operator was called
		if (breakpoint_number === new_breakpoint_number) {
			// new_callback();
			command_callback_pairs.push({
				command: 'watch ptr',
				callback: empty_callback,
			}, {
				command: 'continue',
				callback: object_creation_callback(),
			});
		} else if (breakpoint_number === new_arr_breakpoint_number) {
			// TODO
		} else if (breakpoint_number === delete_breakpoint_number) {
			delete_callback();
		} else if (breakpoint_number === delete_arr_breakpoint_number) {
			// TODO
		}

	// watchpoint triggered
	} else if (watchpoint_line_index !== -1) {
		watchpoint_number = get_word_by_index(responce[watchpoint_line_index], 2).slice(0, -1);
		watchpoint_number = parseInt(watchpoint_number);
		watchpoint_callback(watchpoint_number);
	}
};

// ---------- MAIN PROGRAM ----------

// compile and run code
execSync(`g++ -g ${code_header_file_path} ${code_file_path} -o ${executable_file_path}`);
const gdb = spawn('gdb', ['-q', `${executable_file_path}`], { stdio: ['pipe', 'pipe', 'pipe'] });
gdb.stdout.setEncoding('utf8');

// get gdb outputs and pass them to process_responce
let responce_lines = [];
gdb.stdout.on('data', (data) => {
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
			// process responce
			process_responce(responce_lines);
			// reset responce_lines
			responce_lines = [];
		}
	}
});

gdb.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

gdb.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

(async () => {})();
