import cors from "cors"
import compression from "compression"
import express from "express"
import helmet from "helmet"

import v1Routes from "./routes/v1"
import { createCorsOptions } from "./services/cors/config"
import Database from "./services/mongoose/mongoose"
import { errorHandler } from "./utils/errorHandler"

const PORT = process.env.PORT || 3000

const whitelist = ["http://localhost:3000", "http://localhost:5173"]

async function connectDatabase() {
    await Database.connect()
}

connectDatabase()

const app = express()

app.use(helmet())
app.use(cors(createCorsOptions(whitelist)))
app.use(express.json({ limit: "2mb" }))
app.use(
    express.urlencoded({ limit: "1mb", extended: true, parameterLimit: 5000 })
)
app.use(compression())

app.use("/api/v1", v1Routes)
app.use((req, res) => {
    res.status(404).json({ message: "Not Found", path: req.originalUrl })
})
app.use(errorHandler)

app.listen(PORT, () => {
    return console.log(`Server running on port ${PORT}`)
})

process.on("unhandledRejection", (error) => {
    console.log("unhandledRejection", error)
})

process.on("uncaughtException", (error) => {
    console.log("uncaughtException", error)
})
