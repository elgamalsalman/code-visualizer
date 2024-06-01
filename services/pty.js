// ---------- IMPORTS ----------

// ----- EXTERNAL -----

import { spawn } from "node-pty";

// TODO put this in a config file
// ---------- CONFIG ----------

const PTY_TERMINAL_WIDTH = 999;

// ---------- CLASS ----------

class PTY {
	// ----- STATIC VARIABLES -----

	static #pty_default_options = {
		cols: PTY_TERMINAL_WIDTH,
		rows: 40,
		cwd: process.cwd(),
		env: process.env,
	};

	// ----- STATIC FUNCTIONS -----

	// executes a bash command using a temporary pseudoterminal session
	static execute = async (command, args) => {
		console.error(`[*] executing ${command} with ${args}`);
		return new Promise((resolve, reject) => {
			const pty_process = spawn(command, args, PTY.#pty_default_options);
			let result = "";

			pty_process.on("data", (data) => {
				result += data;
			});

			pty_process.on("exit", (code) => {
				if (code === 0) {
					resolve(result);
				} else {
					// console.error(`[!!!] command {${command}} failed`);
					reject(new Error(result));
				}
			});
		});
	};

	// ----- MEMBER VARIABLES -----

	#process;

	// ----- CONSTRUCTORS -----

	constructor(program, args, pty_options = PTY.#pty_default_options) {
		this.#process = spawn(program, args, pty_options);
		this.#process.setEncoding("utf8");
	}

	// ----- MEMBER FUNCTIONS -----

	// on events
	on = (event, callback) => {
		return this.#process.on(event, callback);
	};

	// write data
	write = (data) => {
		return this.#process.write(data);
	};

	// kill
	kill = () => {
		return this.#process.kill();
	};
}

// ---------- EXPORTS ----------

export default PTY;
