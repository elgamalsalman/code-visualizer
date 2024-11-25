import pg from "pg";
const { Pool } = pg;

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
const pool = new Pool({
	user: DB_USERNAME,
	host: DB_HOST,
	database: DB_NAME,
	password: DB_PASSWORD,
	port: DB_PORT,
});

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on("error", (err, client) => {
	console.error("Unexpected error on idle client", err);
	process.exit(-1);
});

const client = await pool.connect();

export default client;
