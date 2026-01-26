import { Router } from "express";
import { validate } from "../../middleware/validate";
import { createUserSchema } from "./user.schema";
import { createUserController } from "./user.controller";

const router = Router()

/**
 * @openapi
 * /api/users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/create', validate(createUserSchema), createUserController)

export default router