import { ErrorRequestHandler } from "express"

export const errorHandler: ErrorRequestHandler = (err, _req, res) => {
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    })
}
