const run_event_types = {
	compilation: "compilation",
	stdin: "stdin",
	stdout: "stdout",
	stderr: "stderr",
	grapher: "grapher",
	error: "error",
	terminate: "terminate",
};

const get_run_event_template = {
	compilation: (status) => {
		return {
			type: run_event_types.compilation,
			status: status,
		};
	},
	stdin: (data) => {
		return {
			type: run_event_types.stdin,
			data: data,
		};
	},
	stdout: (data) => {
		return {
			type: run_event_types.stdout,
			data: data,
		};
	},
	stderr: (data) => {
		return {
			type: run_event_types.stderr,
			data: data,
		};
	},
	grapher: (event) => {
		return {
			type: run_event_types.grapher,
			event: event,
		};
	},
	error: (error) => {
		return {
			type: run_event_types.error,
			error: error,
		};
	},
	terminate: (status) => {
		return {
			type: run_event_types.terminate,
			status: status,
		};
	},
};

// assert valid file configuration
(() => {
	const keys1 = Object.keys(run_event_types);
	const keys2 = Object.keys(get_run_event_template);
	let valid = true;
	if (keys1.length !== keys2.length) valid = false;
	for (const key1 of keys1) {
		if (!keys2.includes(key1)) valid = false;
	}

	if (!valid) {
		throw Error("Faulty configuration of runs events config!");
	}
})();

export { run_event_types, get_run_event_template };
