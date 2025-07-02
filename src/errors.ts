export class ValidationException extends Error {
    status: number
    details: { field: string; error: string }[]
    constructor(message: string, details: { field: string; error: string }[]) {
        super(message)
        this.name = "ValidationException"
        this.status = 400
        this.details = details
    }
}
