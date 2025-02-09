import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";

export function validateDTO(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const dtoInstance = plainToInstance(dtoClass, req.body);
        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
            res.status(400).json({
                success: false,
                errors: errors.map(err => ({
                    field: err.property,
                    message: Object.values(err.constraints || {}).join(", ")
                }))
            });
            return;

        };
        next();
    }
}
