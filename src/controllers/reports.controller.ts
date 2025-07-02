import { Request, Response } from "express"

import { createReport } from "src/services/mongoose/reports.service"

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
    } = req.body

    const report = await createReport({
        type,
        message,
        lat,
        lng,
        imageUrls,
        authorId,
        barangayId,
        status,
        verifiedInfo,
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
