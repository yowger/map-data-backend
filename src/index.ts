import cors from "cors"
import compression from "compression"
import express from "express"
import helmet from "helmet"

import { connectDatabase } from "./services/mongoose/mongoose"
import v1Routes from "./routes/v1"

const PORT = process.env.PORT || 3000

const whitelist = ["http://localhost:3000"]

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (whitelist.includes(origin) || !origin) {
            callback(null, true)
        } else {
            callback(new Error(`Origin '${origin}' not allowed by CORS`))
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
}

connectDatabase()

const app = express()

app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json({ limit: "2mb" }))
app.use(
    express.urlencoded({ limit: "1mb", extended: true, parameterLimit: 5000 })
)
app.use(compression())

app.use("/api/v1", v1Routes)
app.use((req, res) => {
    res.status(404).json({ message: "Not Found", path: req.originalUrl })
})

app.listen(PORT, () => {
    return console.log(`Server running on port ${PORT}`)
})

process.on("unhandledRejection", (error) => {
    console.log("unhandledRejection", error)
})

process.on("uncaughtException", (error) => {
    console.log("uncaughtException", error)
})
