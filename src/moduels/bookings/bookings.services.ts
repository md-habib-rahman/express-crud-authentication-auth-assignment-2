import { pool } from "../../database/db";


const createBooking = async (payload: Record<string, unknown>) => {
	const {
		customer_id,
		vehicle_id,
		rent_start_date,
		rent_end_date
	} = payload;
	const start = new Date(rent_start_date).getTime();
	const end = new Date(rent_end_date).getTime()

	if (end < start) {
		throw new Error("Rent end date can not be prior than Rent start date");
	}


	// console.log(totalPrice)
	const checkVehicleStatus = await pool.query(`SELECT availability_status FROM vehicles WHERE id=$1`, [vehicle_id]);
	// console.log(checkVehicleStatus.rows[0])
	if (checkVehicleStatus.rows[0].availability_status !== 'available') {
		throw new Error('Vehicle has active reantal!')
	}

	const totalDays: number = (end - start) / (1000 * 60 * 60 * 24);

	const rentVehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicle_id])

	const totalPrice: number = totalDays * rentVehicle.rows[0].daily_rent_price;

	const addBooking = await pool.query(`INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,customer_id,vehicle_id,total_price,status`, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, 'active'])

	const updateVehicle = await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`, ['booked', vehicle_id])

	addBooking.rows[0].rent_start_date = rent_start_date;
	addBooking.rows[0].rent_end_date = rent_end_date;

	addBooking.rows[0].vehicle = {
		vehicle_name: rentVehicle.rows[0].vehicle_name,
		daily_rent_price: rentVehicle.rows[0].daily_rent_price,
	}

	return addBooking.rows[0]
}

export const bookingServices = {
	createBooking,
}