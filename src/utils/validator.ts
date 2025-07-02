import { Request } from "express"
import { z, ZodError } from "zod"

import { ValidationException } from "../errors"

type ValidationSchema = {
    body?: z.AnyZodObject
    params?: z.AnyZodObject
    query?: z.AnyZodObject
}
type InferSchema<T, K extends keyof T> = T[K] extends z.AnyZodObject
    ? z.infer<T[K]>
    : unknown

type ValidationHelpers<T extends ValidationSchema> = {
    getBody(req: Request): InferSchema<T, "body">
    getParams(req: Request): InferSchema<T, "params">
    getQuery(req: Request): InferSchema<T, "query">
}

export function validator<T extends ValidationSchema>(
    schemas: T
): ValidationHelpers<T> {
    function createValidator(key: keyof ValidationSchema) {
        return function (req: Request) {
            try {
                return schemas[key].parse(req[key])
            } catch (error) {
                if (error instanceof ZodError) {
                    const errorDetails = error.errors.map((err) => ({
                        field: err.path.join("."),
                        error: err.message,
                    }))

                    throw new ValidationException(
                        "Validation Error",
                        errorDetails
                    )
                }

                throw error
            }
        }
    }

    return {
        getBody: createValidator("body"),
        getParams: createValidator("params"),
        getQuery: createValidator("query"),
    }
}
