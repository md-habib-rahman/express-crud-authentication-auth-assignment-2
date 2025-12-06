import { pool } from "../../database/db";

const addVehicle = async (payload: Record<string, unknown>) => {
	const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

	const result = await pool.query(`INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);

	return result;
}

const getAllVehicles = async () => {

	const result = await pool.query(`SELECT * FROM vehicles`);

	return result;
}

const getSingleVehicles = async (vehicleId: number) => {

	const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicleId]);

	return result;
}

const updateVehicle = async (payload: Record<string, unknown>) => {

	let updateString: string = '';

	for (const key in payload) {
		if (key !== 'vehicleId') {
			if (typeof payload[key] !== 'number') {
				updateString += `${key}='${payload[key]}', `
			} else {
				updateString += `${key}=${payload[key]}, `
			}

		}
	}
	// console.log(updateString.trim().slice(0, -1))
	const result = await pool.query(`UPDATE vehicles SET ${updateString.trim().slice(0, -1)} WHERE id=$1 RETURNING *`, [payload.vehicleId]);
	return result;
}

const deleteVehicle = async (vehicleId: number) => {
	console.log(vehicleId)
	const result = await pool.query(`DELETE FROM vehicles WHERE id=$1 RETURNING *`, [vehicleId])
	return result;
}

export const vehicleServices = {
	addVehicle,
	getAllVehicles,
	getSingleVehicles,
	updateVehicle,
	deleteVehicle
}