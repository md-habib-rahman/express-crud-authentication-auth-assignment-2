import cron from 'node-cron'
import { pool } from '../database/db'
cron.schedule("0 * * * *", async () => {
	try {
		const result = await pool.query('UPDATE bookings SET status=$1 WHERE rent_start_date < CURRENT_DATE AND status=$2', ['returned', 'active'])
		console.log("updated bookings!")
	} catch (err: any) {
		console.log('update error', err.message)
	}
})