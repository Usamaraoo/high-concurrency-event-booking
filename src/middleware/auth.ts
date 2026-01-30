import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt-token";

export function auth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const payload = verifyToken(token);

        if (!payload) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = payload.data;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}