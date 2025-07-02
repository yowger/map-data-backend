import { Schema, model } from "mongoose"

const UserSchema = new Schema(
    {
        provider: {
            type: String,
            enum: ["google", "facebook"],
            required: false,
        },
        providerId: { type: String },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        avatarUrl: { type: String },
        role: {
            type: String,
            enum: ["user", "moderator", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
)

export default model("User", UserSchema)
