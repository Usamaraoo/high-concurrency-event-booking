import { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler"
import { getBookingById, reserveSeat } from "./booking.service"
import { sendSuccess } from "../../utils/response"

export const reserveSeatController = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user
    const result = await reserveSeat(req.body, user?.id!)
    return sendSuccess(res, result, 'Seat reserved', 200);
})

export const getBookingByIdController = asyncHandler(async (req: Request<{ bookingId: string }>, res: Response) => {
    const result = await getBookingById(req.params.bookingId)
    return sendSuccess(res, result, 'Booking found', 200);
})
// export const createPaymentIntentController = asyncHandler(async (req: Request<{ bookingId: string }>, res: Response) => {
//     console.log('eventId', req.params.bookingId)
//     const user = req.user
//     const result = await createPaymentIntent(user?.id!, req.params.bookingId)
//     return sendSuccess(res, result, 'Payment intent created', 200);
// })