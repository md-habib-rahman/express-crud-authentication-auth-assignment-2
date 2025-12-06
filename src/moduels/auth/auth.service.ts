import bcrypt from "bcryptjs"
import { pool } from "../../database/db"
import jwt from 'jsonwebtoken'
import config from "../../config";


const signUp = async (payload: Record<string, unknown>) => {
	const { name, email, password, phone, role } = payload;

	if (password.length < 6) {
		throw new Error("Password must be at least 6 characters")
	}

	const hashPassword = await bcrypt.hash(password as string, 12);

	const result = await pool.query(`INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING *`, [name, email, hashPassword, phone, role]);

	delete result.rows[0].password;
	return result;
}

const signIn = async (payload: Record<string, unknown>) => {
	const { email, password } = payload;
	const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email])

	// console.log(result.rows[0])

	if (result.rows.length === 0) {
		throw new Error("User not found");
	}

	const matchedPassword = await bcrypt.compare(password as string, result.rows[0].password)

	if (!matchedPassword) {
		throw new Error("Invalid Credentials!")
	}

	const secret = config.jwtSecret;

	const user = result.rows[0];


	const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, secret as string, { expiresIn: '7d' })
	// console.log(token)

	delete user.password;

	return { token, user }
}

export const authServices = {
	signUp,
	signIn
};