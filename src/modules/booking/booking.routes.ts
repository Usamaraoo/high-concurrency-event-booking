import { Router } from "express";
import { auth } from "../../middleware/auth";
import { getBookingByIdController, reserveSeatController } from "./booking.controller";
import { validate } from "../../middleware/validate";
import { reserveSeatsSchema } from "./booking.schema";

const router = Router()

/**
 * @openapi
 * /api/bookings/reserve-seat:
 *   post:
 *     summary: Reserve seats for an event
 *     description: Creates a temporary booking and locks seats in Redis for a limited time.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *               - seats
 *             properties:
 *               event_id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               seats:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Seats reserved successfully
 *       400:
 *         description: Not enough seats available or invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/reserve-seat', auth, validate(reserveSeatsSchema), reserveSeatController)


/**
 * @openapi
 * /api/bookings/{bookingId}:
 *   get:
 *     summary: Get booking by ID
 *     description: Retrieves the details of a specific booking.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking
 *     responses:
 *       200:
 *         description: Booking details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:bookingId', auth, getBookingByIdController)


/**
//  * @openapi
//  * /api/bookings/create-payment-intent/{bookingId}:
//  *   get:
//  *     summary: Create a Stripe Payment Intent
//  *     description: Generates a client secret to complete the payment for a specific booking.
//  *     tags: [Bookings]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: bookingId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the booking
//  *     responses:
//  *       200:
//  *         description: Payment intent created
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 clientSecret:
//  *                   type: string
//  *       404:
//  *         description: Booking not found
//  *       401:
//  *         description: Unauthorized
//  */
// router.get('/create-payment-intent/:bookingId', auth, createPaymentIntentController)





export default router;