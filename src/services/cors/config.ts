import type { CorsOptions } from "cors"

export function createCorsOptions(whitelist: string[]): CorsOptions {
    return {
        origin: (origin, callback) => {
            if (!origin || whitelist.includes(origin)) {
                callback(null, true)
            } else {
                callback(new Error(`Origin '${origin}' not allowed by CORS`))
            }
        },
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        optionsSuccessStatus: 204,
    }
}
