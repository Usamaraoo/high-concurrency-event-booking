import { Router } from "express";
import { createEventController, getEventsController } from "./event.controller";
import { validate } from "../../middleware/validate";
import { createEventSchema } from "./event.schema";

const router = Router()

/**
 * @openapi
 * /api/events/create:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/create', validate(createEventSchema), createEventController)

/**
 * @openapi
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', getEventsController)

export default router;