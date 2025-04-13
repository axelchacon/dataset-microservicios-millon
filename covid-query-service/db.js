import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
	host: process.env.PGHOST,
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	database: process.env.PGDATABASE,
	port: process.env.PGPORT,
});

console.log("🧩 Conectado a la base de datos:", process.env.PGDATABASE);
export default pool;
