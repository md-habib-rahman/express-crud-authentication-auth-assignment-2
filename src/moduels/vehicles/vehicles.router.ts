import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post('/', auth(), vehicleController.addVehicle)
router.get('/', vehicleController.getAllVehicles)
router.get('/:vehicleId', vehicleController.getSingleVehicles)
router.put('/:vehicleId', vehicleController.updateVehicle)
router.delete('/:vehicleId', vehicleController.deleteVehicle)

export const vehicleRoute = router