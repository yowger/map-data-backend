import { Types } from "mongoose"

import User from "../services/mongoose/models/user.model"
import {
    connectDatabase,
    disconnectDatabase,
} from "../services/mongoose/mongoose"

const users = [
    {
        _id: new Types.ObjectId("60f7a1e8f6a2c0a1c4d1b001"),
        name: "Juan Dela Cruz",
        email: "juan@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=juan",
        role: "user",
        provider: "google",
        providerId: "google-juan-001",
    },
    {
        _id: new Types.ObjectId("60f7a1e8f6a2c0a1c4d1b002"),
        name: "Barangay Captain",
        email: "captain@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=captain",
        role: "moderator",
        provider: "google",
        providerId: "google-captain-001",
    },
    {
        _id: new Types.ObjectId("60f7a1e8f6a2c0a1c4d1b003"),
        name: "LGU Admin",
        email: "admin@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=admin",
        role: "admin",
        provider: "google",
        providerId: "google-admin-001",
    },
    {
        _id: new Types.ObjectId("60f7a1e8f6a2c0a1c4d1b004"),
        name: "Maria Santos",
        email: "maria@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=maria",
        role: "user",
        provider: "google",
        providerId: "google-maria-004",
    },
    {
        _id: new Types.ObjectId("60f7a1e8f6a2c0a1c4d1b005"),
        name: "Pedro Gomez",
        email: "pedro@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=pedro",
        role: "user",
        provider: "google",
        providerId: "google-pedro-005",
    },
    {
        _id: new Types.ObjectId("60f7a1e8f6a2c0a1c4d1b006"),
        name: "Ana Reyes",
        email: "ana@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=ana",
        role: "moderator",
        provider: "google",
        providerId: "google-ana-006",
    },
    {
        _id: new Types.ObjectId("60f7a1e8f6a2c0a1c4d1b007"),
        name: "Carlos Rivera",
        email: "carlos@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=carlos",
        role: "user",
        provider: "google",
        providerId: "google-carlos-007",
    },
    {
        _id: new Types.ObjectId("60f7a1e8f6a2c0a1c4d1b008"),
        name: "Rosario Cruz",
        email: "rosario@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=rosario",
        role: "user",
        provider: "google",
        providerId: "google-rosario-008",
    },
]

async function seedUsers() {
    try {
        await connectDatabase()

        await User.deleteMany({})
        await User.insertMany(users)

        console.log("Users seeded successfully")
    } catch (error) {
        console.error("Error seeding users:", error)
    } finally {
        await disconnectDatabase()
    }
}

seedUsers()
