import { pool } from "../../database/db"

const getAllUsers = async () => {
	const result = await pool.query(`SELECT * FROM vehicles`);
	return result
}

export const userServices = {
	getAllUsers
}