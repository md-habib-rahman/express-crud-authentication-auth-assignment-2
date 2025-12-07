import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from "../config"

const auth = () => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const bearerToken = req.headers.authorization

			if (!bearerToken) {
				return res.status(401).send({
					succcess: false,
					message: "Unauthorized!"
				})
			}
			const token = bearerToken.split(' ')[1];
			const decoded = jwt.verify(token as string, config.jwtSecret as string)

			req.user = decoded as JwtPayload
			// console.log(req.user)
			return next();
		} catch (err: any) {
			res.status(401).send({
				success: false,
				message: err.message
			})
		}
	}
}

export default auth