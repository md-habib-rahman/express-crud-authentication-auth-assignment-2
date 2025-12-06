import { Router } from "express";
import { vehicleController } from "./vehicles.controller";

const router = Router();

router.post('/', vehicleController.addVehicle)
router.get('/', vehicleController.getAllVehicles)
router.get('/:vehicleId', vehicleController.getSingleVehicles)

export const vehicleRoute = router