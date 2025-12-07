import { Request, Response } from "express";
import { userServices } from "./user.services";


const getAllUsers = async (req: Request, res: Response) => {
	try {

		if (req.user?.role !== 'admin') {
			const error: any = new Error('Forbidden!')
			error.statusCode = 403;
			throw error;
		}
		const result = await userServices.getAllUsers()
		if (result.rowCount > 0) {
			return res.status(200).send({
				success: true,
				message: "Users retrieved successfully",
				data: result.rows
			})
		}
		return res.status(200).send({
			success: true,
			message: "No user found!",

		})
	} catch (err: any) {
		return res.status(err.statusCode || 500).json({
			success: false,
			message: err.message,

		})
	}
}

const updateUser = async (req: Request, res: Response) => {
	const newUser = { ...req.params, ...req.body }
	try {
		const result = await userServices.updateUser(newUser)
		if (result.rowCount > 0) {
			res.status(200).send({
				success: true,
				message: "User updated successfully",
				data: result.rows
			})
		}
	} catch (err: any) {
		res.status(500).send({
			success: false,
			message: err.message
		})
	}

}

const deleteUser = async (req: Request, res: Response) => {
	const { userId } = req.params
	try {
		const result = await userServices.deleteUser(userId)
		if (result.rowCount > 0) {
			res.status(200).send({
				"success": true,
				"message": "User deleted successfully"
			})
		}
	} catch (err: any) {
		res.status(500).send({
			success: false,
			message: err.message
		})
	}
}

export const userControler = {
	getAllUsers, updateUser, deleteUser
}