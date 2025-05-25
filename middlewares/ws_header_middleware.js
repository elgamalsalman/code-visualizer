const ws_header = async (req, res, next) => {
	const protocols = req.headers["sec-websocket-protocol"]
		.split(",")
		.map((val) => val.trim());

	const [_, encoded_header] = protocols;

	req.body = JSON.parse(
		decodeURIComponent(atob(encoded_header.replace(/-/g, "/")))
	);

	next();
};

export default ws_header;
