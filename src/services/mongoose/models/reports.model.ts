import { Schema, model, Types } from "mongoose"

const ReportSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 100,
            trim: true,
        },
        description: {
            type: String,
            required: false,
            maxlength: 1000,
            trim: true,
        },
        barangayId: { type: String },
        type: { type: String, required: true },
        message: String,
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        imageUrls: [String],
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
