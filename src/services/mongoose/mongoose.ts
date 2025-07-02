import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const CONNECTED = 1

class Database {
    private static instance: Database
    private constructor() {}

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }

    public async connect() {
        if (mongoose.connection.readyState === CONNECTED) {
            return
        }

        const uri = process.env.MONGO_URI
        await mongoose.connect(uri)

        console.log("Connected to MongoDB")

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err)
        })

        mongoose.connection.on("disconnected", () => {
            console.log("Disconnected from MongoDB")
        })

        return mongoose.connection.db
    }

    public async drop() {
        if (mongoose.connection.readyState !== CONNECTED) {
            await this.connect()
        }

        await mongoose.connection.db.dropDatabase()

        console.log("Dropped MongoDB database")
    }

    public async disconnect() {
        await mongoose.disconnect()
    }
}

export default Database.getInstance()
