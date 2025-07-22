import { Request, Response } from "express"

import { barangaysList } from "../services/geojson/barangayUtils"
import reportsModel from "../services/mongoose/models/reports.model"
import type { Barangay, BarangayWithReportsList } from "src/types/map"

export async function getBarangays(req: Request, res: Response<Barangay[]>) {
    const simplified = barangaysList.map((barangay) => ({
        id: barangay.id,
        name: barangay.name,
    }))

    res.status(200).json(simplified)
}

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
                barangayId: 1,
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
