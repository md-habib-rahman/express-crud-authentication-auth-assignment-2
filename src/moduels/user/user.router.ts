import { Router } from "express";
import { userControler } from "./user.controller";
import auth from "../../middleware/auth";




const router = Router()

router.get('/', auth(), userControler.getAllUsers)
router.put('/:userId', userControler.updateUser)
router.delete('/:userId', userControler.deleteUser)

export const userRoute = router