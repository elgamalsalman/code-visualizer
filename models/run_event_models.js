const run_event_types = {
	connection: "connection",
	compilation: "compilation",
	stdin: "stdin",
	stdout: "stdout",
	stderr: "stderr",
	grapher: "grapher",
	error: "error",
	terminate: "terminate",
};

const run_event_data_types = [
	run_event_types.stdin,
	run_event_types.stdout,
	run_event_types.stderr,
	run_event_types.grapher,
];

const run_event_statuses = {
	success: "success",
	failed: "failed",
	killed: "killed",
};

const grapher_event_types = {
	create: "create",
	change: "change",
	delete: "delete",
};

const get_run_event = {
	connection: (status, error = "") => {
		if (status === run_event_statuses.success) {
			return {
				type: run_event_types.connection,
				status: status,
			};
		} else if (status === run_event_statuses.failed) {
			return {
				type: run_event_types.connection,
				status: status,
				error: error,
			};
		} else console.error(`Connecting with unknown status of ${status}`);
	},
	compilation: (status, error = "") => {
		if (status === run_event_statuses.success) {
			return {
				type: run_event_types.compilation,
				status: status,
			};
		} else if (status === run_event_statuses.failed) {
			return {
				type: run_event_types.compilation,
				status: status,
				error: error,
			};
		} else console.error(`Compiling with unknown status of ${status}`);
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
	grapher: {
		create: (cls, id, props) => {
			return {
				type: run_event_types.grapher,
				event: {
					type: grapher_event_types.create,
					class: cls,
					id: id,
					props: props,
				},
			};
		},
		change: (cls, id, props) => {
			return {
				type: run_event_types.grapher,
				event: {
					type: grapher_event_types.change,
					class: cls,
					id: id,
					props: props,
				},
			};
		},
		delete: (cls, id) => {
			return {
				type: run_event_types.grapher,
				event: {
					type: grapher_event_types.delete,
					class: cls,
					id: id,
				},
			};
		},
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
	let valid = true;
	const run_keys1 = Object.keys(run_event_types);
	const run_keys2 = Object.keys(get_run_event);
	if (run_keys1.length !== run_keys2.length) valid = false;
	for (const run_key1 of run_keys1) {
		if (!run_keys2.includes(run_key1)) valid = false;
	}
	const grapher_keys1 = Object.keys(grapher_event_types);
	const grapher_keys2 = Object.keys(get_run_event.grapher);
	if (grapher_keys1.length !== grapher_keys2.length) valid = false;
	for (const grapher_key1 of grapher_keys1) {
		if (!grapher_keys2.includes(grapher_key1)) valid = false;
	}

	if (!valid) {
		throw Error("Faulty configuration of runs events config!");
	}
})();

export {
	run_event_types,
	run_event_data_types,
	run_event_statuses,
	grapher_event_types,
	get_run_event,
};
