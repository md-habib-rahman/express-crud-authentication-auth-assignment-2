import { Router } from "express";
import { userControler } from "./user.controller";
import auth from "../../middleware/auth";




const router = Router()

router.get('/', auth(), userControler.getAllUsers)
router.put('/:userId',auth(), userControler.updateUser)
router.delete('/:userId',auth(), userControler.deleteUser)

export const userRoute = router