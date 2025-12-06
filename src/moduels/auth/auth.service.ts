import bcrypt from "bcryptjs"
import { pool } from "../../database/db"


const signUp = async (payload: Record<string, unknown>) => {
	const { name, email, password, phone } = payload;
	const hashPassword = await bcrypt.hash(password as string, 12)
	const result = await pool.query(`INSERT INTO users(name,email,password,phone) VALUES($1,$2,$3,$4) RETURNING *`, [name, email, hashPassword, phone]);

	delete result.rows[0].password;
	return result;
}

export const authServices = {
	signUp,
};