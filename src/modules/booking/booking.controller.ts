import { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler"
import { reserveSeat } from "./booking.service"
import { sendSuccess } from "../../utils/response"

export const reserveSeatController = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user
    const result = await reserveSeat(req.body, user?.id!)
    return sendSuccess(res, result, 'Seat reserved', 200);
})