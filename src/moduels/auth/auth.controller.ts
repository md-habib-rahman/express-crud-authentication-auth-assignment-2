import { Request, Response } from "express"

import { authServices } from "./auth.service"


const signUp = async (req: Request, res: Response) => {

	try {
		const result = await authServices.signUp(req.body)
		if (result.rowCount > 0) {
			return res.status(201).send({
				success: true,
				message: "User registered successfully",
				data: result.rows
			})
		}
	} catch (err: any) {
		return res.status(500).send({
			success: false,
			message: err.message
		})
	}
}

const signIn = async (req: Request, res: Response) => {
	try {
		const result = await authServices.signIn(req.body)

		res.status(200).send({
			success: true,
			message: "Login successful",
			data: result
		})
	} catch (err: any) {
		res.status(500).send({
			success: false,
			message: err.message
		})
	}
}

export const authController = {
	signUp,
	signIn
}