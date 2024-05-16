// ---------- IMPORTS ----------

// ----- EXTERNAL -----

import { strict as assert } from "assert";

// ----- INTERNAL -----

// utils
import { create_externally_resolvable_promise } from "../utils/promise_utils.js";
import { ansi_normalize, tokenize } from "../utils/string_utils.js";

// controllers
import PTY from "./pty.js";

// ---------- CLASS ----------

class GDB {
	// ----- STATIC FUNCTIONS -----

	// checks if responce is from a controlpoint
	static is_controlpoint = (res) => {
		const tokens = tokenize(res[0]);
		if (
			tokens[0].toLowerCase() === "breakpoint" ||
			tokens[0].toLowerCase() === "watchpoint"
		) {
			return true;
		}
		return false;
	};

	// get controlpoint number
	static get_controlpoint_number = (res) => {
		const tokens = tokenize(res[0]);
		if (tokens[0].toLowerCase() === "breakpoint") {
			return parseInt(tokens[1]);
		} else if (tokens[0].toLowerCase() === "watchpoint") {
			return parseInt(tokens[1]);
		}
		console.log("[!!!] COULDN'T EXTRACT CONTROLPOINT NUMBER");
		assert(false);
		return -1;
	};

	// get watchpoint subject
	static get_watchpoint_subject = (res) => {
		const tokens = tokenize(res[1]);
		return tokens.slice(3).join(" ");
	};

	// get watchpoint old value
	static get_watchpoint_old_value = (res) => {
		const line = tokenize(res[1]);
		return line[line.length - 1];
	};

	// get watchpoint new value
	static get_watchpoint_new_value = (res) => {
		const line = tokenize(res[2]);
		return line[line.length - 1];
	};

	// ----- MEMBER VARIABLES -----

	#gdb;
	#init_promise;
	#command_promise;
	#responce_promise;

	#responce_lines = [];
	#echo = null;

	// ----- CONSTRUCTORS -----

	constructor(options) {
		// initialize promises
		this.#command_promise = create_externally_resolvable_promise();
		this.#responce_promise = create_externally_resolvable_promise();
		this.#init_promise = create_externally_resolvable_promise();

		// initialize pty
		this.#gdb = new PTY("gdb", options);
		this.#gdb.on("data", this.#on_gdb_data);

		// async
		this.#init();
	}

	// ----- MEMBER FUNCTIONS -----

	// --- PRIVATE ---

	// initialisation
	#init = async () => {
		// wait for gdb startup
		await this.#responce_promise;
		this.#init_promise.resolve();
	};

	// process incoming data from gdb stdout
	#on_gdb_data = async (data) => {
		data = ansi_normalize(data.toString()).trim();
		console.error(`[*] on_gdb_data ${data}`);

		// split
		const delimiter = "(gdb)";
		const delimiter_escaped = "\\(gdb\\)";
		const regex = new RegExp(
			`(((?!(${delimiter_escaped})).)+|${delimiter_escaped})`,
			"g"
		);
		let responces_delimited = data.match(regex);
		if (responces_delimited === null) {
			responces_delimited = [];
		}

		for (const responce of responces_delimited) {
			// if responce
			if (responce !== delimiter) {
				// add to responce lines
				responce.split("\n").forEach((line, i) => {
					this.#responce_lines.push(line.trim());
				});

				// else if delimiter
			} else {
				// remove echo
				if (this.#echo !== null) {
					// assert echoing
					assert(this.#echo === this.#responce_lines[0]);
					// remove first element in array
					this.#responce_lines.shift();
				}

				// process responce and get next command
				this.#command_promise = create_externally_resolvable_promise();
				this.#responce_promise.resolve(this.#responce_lines);
				const command = await this.#command_promise;

				// send command
				this.#gdb.write(command + "\n");
				this.#echo = command;

				// reset responce_lines
				this.#responce_lines = [];
			}
		}
	};

	// --- PUBLIC ---

	// on events
	on = (event, callback) => {
		return this.#gdb.on(event, callback);
	};

	// kill
	kill = () => {
		return this.#gdb.kill();
	};

	// executes one gdb command and returns the responce async
	execute = async (command) => {
		// await initialisation
		await this.#init_promise;

		console.error(`[*] gdb execute ${command}`);

		this.#responce_promise = create_externally_resolvable_promise();
		this.#command_promise.resolve(command);
		return await this.#responce_promise;
	};

	// gets variable address
	get_variable_address = async (subject) => {
		// await initialisation
		await this.#init_promise;

		const res = await this.execute(`x &(${subject})`);
		const tokens = tokenize(res[0]);
		return tokens[0];
	};

	// examine value pointed to by given subject
	examine_pointed_value = async (subject, format = "") => {
		// await initialisation
		await this.#init_promise;

		const res = await this.execute(`x/${format} ${subject}`);

		const result_arr = [];
		for (const line of res) {
			const tokens = tokenize(line);
			const slicing_index = tokens.findIndex((e) => e === ":") + 1;
			const line_result_tokens = tokens.slice(slicing_index);
			result_arr.push(...line_result_tokens);
		}

		return result_arr.join(" ");
	};
}

// ---------- EXPORTS ----------

export default GDB;
