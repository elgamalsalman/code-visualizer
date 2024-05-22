const ws_header = async (req, res, next) => {
	const protocols = req.headers["sec-websocket-protocol"]
		.split(",")
		.map((val) => val.trim());

	const [_, user_id] = protocols;

	req.body = {
		user_id: user_id,
	};

	next();
};

export default ws_header;
