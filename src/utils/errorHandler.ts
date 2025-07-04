import { NextFunction, Request, Response } from "express"
import { ValidationException } from "../errors"

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof ValidationException) {
        res.status(err.status).json({
            message: err.message,
            errors: err.details,
        })
    }

    res.status(500).json({
        message: "Internal Server Error",
    })
}
