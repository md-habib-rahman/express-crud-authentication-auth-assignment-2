import { Request, Response } from "express";
import { bookingServices } from "./bookings.services";

const createBooking = async (req: Request, res: Response) => {
	try {
		const result = await bookingServices.createBooking(req.body)
		res.status(200).send({
			success: true,
			message: "Booking created successfully",
			data: result
		})
	} catch (err: any) {
		res.status(500).send({
			success: false,
			message: `${err.message} error from here`,

		})
	}

}

export const bookingController = {
	createBooking,
}