import bcrypt from "bcryptjs";
import { pool } from "../../database/db"

const getAllUsers = async () => {
	const result = await pool.query(`SELECT id,name,email,phone,role FROM users`);
	return result
}
const updateUser = async (payload: Record<string, unknown>) => {


	let updateString: string = '';

	for (const key in payload) {
		if (key !== 'userId') {
			updateString += `${key}='${payload[key]}', `
		}
	}
	// console.log(updateString.trim().slice(0, -1))
	const result = await pool.query(`UPDATE users SET ${updateString.trim().slice(0, -1)} WHERE id=$1 RETURNING *`, [payload.userId]);
	delete result.rows[0].password;
	return result;
}
const deleteUser = async (userId: number) => {
	const checkUserBookings = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1 AND status=$2`, [userId, 'active'])
	if (checkUserBookings.rowCount < 1) {
		const result = await pool.query(`DELETE FROM users WHERE id=$1`, [userId])
		return result;
	} else {
		throw new Error("This User has active bookings!")
	}
}

export const userServices = {
	getAllUsers, updateUser, deleteUser
}