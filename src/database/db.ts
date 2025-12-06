import { Pool } from "pg"
import config from "../config"

export const pool = new Pool({
	connectionString: config.connectionString
})

export const initDB = async () => {
	await pool.query(`
		CREATE TABLE IF NOT EXISTS users(
		id SERIAL,
		name VARCHAR(250) NOT NULL,
		email VARCHAR(250) UNIQUE NOT NULL,
		password TEXT NOT NULL,
		phone VARCHAR(15) NOT NULL,
		role VARCHAR(10)
		)`)
}
