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
		email VARCHAR(250) UNIQUE NOT NULL CHECK (email = LOWER(email)),
		password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
		phone VARCHAR(15) NOT NULL,
		role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'customer'))
		)`)

	await pool.query(`
			CREATE TABLE IF NOT EXISTS vehicles(
			id SERIAL,
			vehicle_name VARCHAR(100) NOT NULL,
			type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
			registration_number VARCHAR(50) NOT NULL UNIQUE,
			daily_rent_price INT NOT NULL CHECK (daily_rent_price > 0),
			availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked'))
			)`)
}
