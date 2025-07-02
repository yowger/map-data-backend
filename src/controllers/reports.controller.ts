import { Request, Response } from "express"
import { z } from "zod"

import { createReport } from "src/services/mongoose/reports.service"
import { validator } from "src/utils/validator"

export const verifiedInfoSchema = z.object({
    verifiedBy: z.string().min(1),
    verifiedAt: z.coerce.date(),
})

export const createReportSchema = z.object({
    type: z.string().min(1, "Report type is required"),
    message: z.string().optional(),
    lat: z.number(),
    lng: z.number(),
    imageUrls: z.array(z.string().url()).optional(),
    authorId: z.string().min(1, "Author ID is required"),
    barangayId: z.string().optional(),
    status: z.enum(["pending", "verified", "rejected", "archived"]).optional(),
    verifiedInfo: verifiedInfoSchema.optional(),
})

const { getBody } = validator({
    body: createReportSchema,
})

export async function createReportHandler(req: Request, res: Response) {
    const {
        type,
        message,
        lat,
        lng,
        imageUrls,
        authorId,
        barangayId,
        status,
        verifiedInfo,
    } = getBody(req)

    let sanitizedVerifiedInfo = undefined

    if (verifiedInfo?.verifiedAt && verifiedInfo?.verifiedBy) {
        sanitizedVerifiedInfo = {
            verifiedBy: verifiedInfo.verifiedBy,
            verifiedAt: verifiedInfo.verifiedAt,
        }
    }

    const report = await createReport({
        type,
        message,
        lat,
        lng,
        imageUrls,
        authorId,
        barangayId,
        status,
        verifiedInfo: sanitizedVerifiedInfo,
    })

    res.status(201).json({ report })
}

export async function getReport(req: Request, res: Response) {
    res.json({ message: "get reports" })
}

export async function getReports(req: Request, res: Response) {
    res.json({ message: "get report" })
}

export async function updateReport(req: Request, res: Response) {
    res.json({ message: "update report" })
}
