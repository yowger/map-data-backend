import User from "../services/mongoose/models/users.model"
import Report from "../services/mongoose/models/reports.model"
import database from "../services/mongoose/mongoose"

async function resetDatabase() {
    await database.connect()

    await User.deleteMany({})
    await Report.deleteMany({})

    console.log("Dropped database successfully")

    await database.disconnect()
}

resetDatabase()
