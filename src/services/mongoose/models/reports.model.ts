import { Schema, model, Types } from "mongoose"

const ReportSchema = new Schema(
    {
        barangayId: { type: String },
        type: { type: String, required: true },
        message: String,
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        imageUrls: [String],
        authorId: { type: Types.ObjectId, required: true },
        status: {
            type: String,
            enum: ["pending", "verified", "rejected", "archived"],
            default: "pending",
        },
        verifiedInfo: {
            verifiedBy: { type: Types.ObjectId },
            verifiedAt: { type: Date },
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
                default: "Point",
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
    },
    { timestamps: true }
)

ReportSchema.index({ location: "2dsphere" })

export default model("Report", ReportSchema)
