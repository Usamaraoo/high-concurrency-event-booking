// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { sendError } from './response';

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Error Stack:", err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Use your consistent sendError utility!
    return sendError(res, message, statusCode, err.errors || null);
};