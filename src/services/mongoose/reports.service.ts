import Report from "./models/reports.model"
import { Types } from "mongoose"

export async function createReport(data: {
    type: string
    message?: string
    lat: number
    lng: number
    imageUrls?: string[]
    authorId: string
    barangayId?: string
    status?: "pending" | "verified" | "rejected" | "archived"
    verifiedInfo?: {
        verifiedBy: string
        verifiedAt: Date
    }
}) {
    const verifiedInfo = data.verifiedInfo
        ? {
              verifiedBy: new Types.ObjectId(data.verifiedInfo.verifiedBy),
              verifiedAt: data.verifiedInfo.verifiedAt,
          }
        : undefined

    return await Report.create({
        type: data.type,
        message: data.message,
        lat: data.lat,
        lng: data.lng,
        imageUrls: data.imageUrls || [],
        authorId: new Types.ObjectId(data.authorId),
        barangayId: data.barangayId,
        status: data.status || "pending",
        verifiedInfo: verifiedInfo,
        location: {
            type: "Point",
            coordinates: [data.lng, data.lat],
        },
    })
}
