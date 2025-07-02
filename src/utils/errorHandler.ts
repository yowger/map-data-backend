import { Request, Response } from "express"
import { ValidationException } from "../errors"

export const errorHandler = (err: Error, req: Request, res: Response) => {
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
