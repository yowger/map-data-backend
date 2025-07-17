import { Request, Response } from "express"

import { barangaysList } from "../services/geojson/readBarangayGeo"
import reportsModel from "../services/mongoose/models/reports.model"

export async function getBarangays(req: Request, res: Response) {
    res.status(200).json(barangaysList)
}

export type ReportSummary = {
    _id: string
    barangayId: string
    type: string
    status: "pending" | "verified" | "rejected" | "archived"
    createdAt: string
}

export type BarangayWithReports = {
    id: string
    name: string
    areaSqKm: number
    areaHa: number
    recentReports: ReportSummary[]
}

export type BarangayWithReportsList = BarangayWithReports[]

export async function getBarangaysWithReports(
    req: Request,
    res: Response<BarangayWithReportsList>
) {
    const reportData = await reportsModel.aggregate([
        {
            $sort: { createdAt: -1 },
        },
        {
            $project: {
                type: 1,
                status: 1,
                createdAt: 1,
                _id: 1,
            },
        },
        {
            $group: {
                _id: "$barangayId",
                recentReports: { $push: "$$ROOT" },
            },
        },
        {
            $project: {
                recentReports: { $slice: ["$recentReports", 3] },
            },
        },
    ])

    const reportMap = new Map(
        reportData.map((item) => [item._id, item.recentReports])
    )

    const merged = barangaysList.map((barangay) => ({
        ...barangay,
        recentReports: reportMap.get(barangay.id) || [],
    }))

    res.status(200).json(merged)
}
