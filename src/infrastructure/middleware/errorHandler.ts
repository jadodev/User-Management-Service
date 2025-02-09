import { Request, Response, NextFunction } from "express";
import { BaseError } from "../../exceptions/BaseError";
import { ValidationError } from "../../exceptions/ValidationError";
import { NotFoundError } from "../../exceptions/NotFoundError";

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): Response => {
    console.error("Error detectado:", err);

    if (err instanceof BaseError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errorCode: err.errorCode,
        });
    }

    if (err instanceof ValidationError) {
        return res.status(400).json({ success: false, message: err.message });
    }

    if (err instanceof NotFoundError) {
        return res.status(404).json({ success: false, message: err.message });
    }

    return res.status(500).json({ success: false, message: "INTERNAL_SERVER_ERROR" });
};
