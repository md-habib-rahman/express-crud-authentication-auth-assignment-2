import { Request, Response } from "express";
import { userServices } from "./user.services";


const getAllUsers = async (req: Request, res: Response) => {
	try {
		const result = await userServices.getAllUsers()
		if (result.rowCount > 0) {

		}
	} catch (err: any) {
		res.status(500).send({
			success: false,
			message: err.message
		})
	}
}