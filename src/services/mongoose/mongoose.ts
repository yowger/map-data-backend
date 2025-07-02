import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

export async function connectDatabase() {
    mongoose.connect(process.env.MONGO_URI)

    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB")
    })

    mongoose.connection.on("error", (error) => {
        console.log("Error connecting to MongoDB", error)
    })

    mongoose.connection.on("disconnected", () => {
        console.log("Disconnected from MongoDB")
    })
}

export async function disconnectDatabase() {
    await mongoose.disconnect()
}
