import { Request, Response } from "express";
import { bookingServices } from "./bookings.services";

const createBooking = async (req: Request, res: Response) => {
	try {
		if (req.user?.role !== 'admin' && req.user?.role !== 'customer') {
			const error: any = new Error('Forbidden!')
			error.statusCode = 403;
			throw error;
		}
		const result = await bookingServices.createBooking(req.body)
		res.status(200).send({
			success: true,
			message: "Booking created successfully",
			data: result
		})
	} catch (err: any) {
		res.status(err.statusCode || 500).send({
			success: false,
			message: err.message,
		})
	}

}

const getBooking = async (req: Request, res: Response) => {
	try {
		if (req.user?.role !== 'admin' && req.user?.role !== 'customer') {
			const error: any = new Error('Forbidden!')
			error.statusCode = 403;
			throw error;
		}

		if (req.user?.role === 'admin') {
			const result = await bookingServices.getAllBooking()
			return res.status(200).send({
				success: true,
				message: "Bookings retrieved successfully",
				data: result
			})
		} else if (req.user?.role === 'customer') {
			const { id } = req.user;
			const result = await bookingServices.getUserBooking(id)
			return res.status(200).send({
				success: true,
				message: "Your bookings retrieved successfully",
				data: result
			})
		}
	} catch (err: any) {
		return res.status(err.statusCode || 500).send({
			success: false,
			message: err.message
		})
	}
}

const updateBooking = async (req: Request, res: Response) => {
	const { role, id } = req.user;
	const { status } = req.body;
	const { bookingId } = req.params;
	const newPaylod = { status, bookingId, id }
	try {
		if (role === 'admin' && status === 'returned') {
			const result = await bookingServices.updateAdminBooking(newPaylod);
			return res.status(200).send({
				success: true,
				message: "Booking marked as returned. Vehicle is now available",
				data: result
			})
		}
		if (role === 'customer' && status === 'cancelled') {
			const result = await bookingServices.updateCustomerBooking(newPaylod);
			return res.status(200).send({
				success: true,
				message: "Booking cancelled successfully",
				data: result
			})
		}
	} catch (err: any) {
		return res.status(500).send({
			success: false,
			message: err.message
		})
	}
}

export const bookingController = {
	createBooking, getBooking, updateBooking
}