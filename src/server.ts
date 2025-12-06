import express, { Request, Response } from 'express'
import { Pool } from 'pg'
import { initDB } from './database/db'
import { authRoute } from './moduels/auth/auth.router'
import config from './config'
import { vehicleRoute } from './moduels/vehicles/vehicles.router'
import { userRoute } from './moduels/user/user.router'

const app = express()
app.use(express.json())
const port = config.port


initDB()

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/vehicles', vehicleRoute)
app.use('/api/v1/users', userRoute)

app.post('/', async (req: Request, res: Response) => {

})

app.get('/', (req: Request, res: Response) => {
	res.status(200).send({
		message: 'This is the api root',
		path: req.path,
	})
})

app.listen(port, () => {
	console.log(`server is running on port ${port}`)
})