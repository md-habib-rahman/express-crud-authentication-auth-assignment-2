import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.services"



const addVehicle = async (req: Request, res: Response) => {
	try {
		const result = await vehicleServices.addVehicle(req.body);
		if (result.rowCount > 0) {
			return res.status(201).send({
				success: true,
				message: "Vehicle created successfully",
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

const getAllVehicles = async (req: Request, res: Response) => {
	try {
		const result = await vehicleServices.getAllVehicles();
		if (result.rowCount > 0) {
			return res.status(200).send({
				success: true,
				message: "Vehicles retrieved successfully",
				data: result.rows
			})
		} else {
			return res.status(200).send({
				success: true,
				message: "No vehicles found",

			})
		}
	} catch (err: any) {
		return res.status(500).send({
			success: false,
			message: err.message
		})
	}
}

const getSingleVehicles = async (req: Request, res: Response) => {
	const { vehicleId } = req.params
	try {
		const result = await vehicleServices.getSingleVehicles(vehicleId)
		if (result.rowCount > 0) {
			return res.status(200).send({
				success: true,
				message: "Vehicles retrieved successfully",
				data: result.rows
			})
		} else {
			return res.status(200).send({
				success: true,
				message: "No vehicles found",

			})
		}
	} catch (err: any) {
		return res.status(500).send({
			success: false,
			message: err.message
		})
	}
}

export const vehicleController = {
	addVehicle,
	getAllVehicles,
	getSingleVehicles

}