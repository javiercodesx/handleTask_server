import type { NextFunction, Request, Response } from "express";
import { Result, validationResult } from "express-validator";
import type { ValidationError } from "express-validator";

export const handleInputErrors: (req: Request, res: Response, next: NextFunction) => void = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    let errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    next();
};