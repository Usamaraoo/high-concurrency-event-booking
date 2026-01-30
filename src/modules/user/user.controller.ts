import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { CreateUserOutput, SigninUser, } from "./user.schema";
import { getUserById, loginUser, signupUser } from "./user.service";
import { sendSuccess } from "../../utils/response";
import envConfig from "../../config/envConfig";
import { ENV } from "../../constant";

export const signupUserController = asyncHandler(async (req: Request<{}, {}, CreateUserOutput>, res: Response) => {
    const body = req.body
    const user = await signupUser(body);
    return sendSuccess(res, user, 'User created', 201);
});


export const loginController = asyncHandler(async (req: Request<{}, {}, SigninUser>, res: Response) => {
    const token = await loginUser(req.body)
    res.cookie('token', token, { httpOnly: true, secure: envConfig.server.env === ENV.PRODUCTION })
    return sendSuccess(res, token, 'User logged in', 200);

})


export const getUserController = asyncHandler(async (req: Request, res: Response) => {
    const id = req.user?.id
    const user = await getUserById(id!)
    return sendSuccess(res, user, 'User found', 200);
})