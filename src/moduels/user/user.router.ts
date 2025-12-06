import { Router } from "express";
import { userControler } from "./user.controller";




const router = Router()

router.get('/', userControler.getAllUsers)
router.put('/:userId', userControler.updateUser)
router.delete('/:userId', userControler.deleteUser)

export const userRoute = router