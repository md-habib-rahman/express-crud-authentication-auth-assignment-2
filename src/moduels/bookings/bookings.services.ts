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

const getAllBooking = async () => {
	const result = await pool.query(`SELECT * FROM bookings`);
	const newResult = [...result.rows]

	for (let i = 0; i < result.rows.length; i++) {

		const findVehicle = await pool.query('SELECT vehicle_name,registration_number FROM vehicles WHERE id=$1', [result.rows[i].vehicle_id]);

		newResult[i].vehicle = findVehicle.rows[0];
	}
	for (let i = 0; i < result.rows.length; i++) {

		const findCustomer = await pool.query('SELECT name,email FROM users WHERE id=$1', [result.rows[i].customer_id]);

		newResult[i].customer = findCustomer.rows[0];
	}
	// console.log(newResult)
	return newResult;
}
const getUserBooking = async (id: number) => {
	const result = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`, [id]);
	const newResult = [...result.rows];
	console.log(result.rows)
	for (let i = 0; i < result.rows.length; i++) {

		const findVehicle = await pool.query('SELECT vehicle_name,registration_number,type FROM vehicles WHERE id=$1', [result.rows[i].vehicle_id]);

		newResult[i].vehicle = findVehicle.rows[0];
	}
	return newResult;

}

const updateAdminBooking = async (payload: Record<string, unknown>) => {
	const { status, bookingId } = payload;
	const result = await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`, [status, bookingId]);
	const updateVehicle = await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING availability_status`, ['available', result.rows[0].vehicle_id])

	result.rows[0].vehicle = updateVehicle.rows[0]
	return result.rows[0];
}

const updateCustomerBooking = async (payload: Record<string, unknown>) => {
	const { status, bookingId, id: customerID } = payload;

	const result = await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 AND customer_id=$3 RETURNING *`, [status, bookingId, customerID]);
	if (result.rowCount < 1) {
		throw new Error("You are not allowed to update this booking!")
	}

	const updateVehicle = await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING availability_status`, ['available', result.rows[0].vehicle_id])

	// result.rows[0].vehicle = updateVehicle.rows[0]
	return result.rows[0];
}

export const bookingServices = {
	createBooking, getAllBooking, getUserBooking, updateAdminBooking, updateCustomerBooking
}