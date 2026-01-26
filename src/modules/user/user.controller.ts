import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { CreateUserOutput } from "./user.schema";
import { createUser } from "./user.service";
import { sendSuccess } from "../../utils/response";

export const createUserController = asyncHandler(async (req: Request<{}, {}, CreateUserOutput>, res: Response) => {
    const body = req.body
    const user = await createUser(body);
    return sendSuccess(res, user, 'User created', 201);
});