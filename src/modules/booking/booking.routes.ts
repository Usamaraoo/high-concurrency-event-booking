import { Router } from "express";
import { auth } from "../../middleware/auth";
import { reserveSeatController } from "./booking.controller";
import { validate } from "../../middleware/validate";
import { reserveSeatsSchema } from "./booking.schema";

const router = Router()

router.post('/reserve-seat', auth, validate(reserveSeatsSchema), reserveSeatController)

export default router