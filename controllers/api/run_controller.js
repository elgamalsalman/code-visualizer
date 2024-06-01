class Run_Controller {
	constructor() {
		// empty constructor
	}

	run = (req, res, next) => {
		// TODO: run controller
		next(new Error("not implemented yet"));
	};
}

const run_controller = new Run_Controller();

export default run_controller;
