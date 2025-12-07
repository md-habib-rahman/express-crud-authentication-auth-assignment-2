import { Router } from "express";
import { bookingController } from "./bookings.controller";
import auth from "../../middleware/auth";

const router = Router()

router.post('/', auth(), bookingController.createBooking)
router.get('/', auth(), bookingController.getBooking)
router.put('/:bookingId', auth(), bookingController.updateBooking)

export const bookingRoutes = router