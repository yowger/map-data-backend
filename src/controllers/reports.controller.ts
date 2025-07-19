import { Request, Response } from "express"
import type { Feature, Point } from "geojson"
import Supercluster from "supercluster"
import { z } from "zod"

import { createReport } from "../services/mongoose/reports.service"
import Report from "../services/mongoose/models/reports.model"
import { validator } from "../utils/validator"
import { Types } from "mongoose"
import { getBarangayName } from "../services/geojson/barangayUtils"

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
    // add pinpoint location to barangay base on lan, lng
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

const reportsQuerySchema = z.object({
    bbox: z
        .string()
        .transform((val) =>
            val
                .replace(/[\[\]]/g, "")
                .split(",")
                .map(Number)
        )
        .refine((arr) => arr.length === 4 && arr.every((n) => !isNaN(n)), {
            message: "bbox must be 4 valid numbers",
        }),
    zoom: z.coerce.number().int().nonnegative(),
})

const { getQuery } = validator({
    query: reportsQuerySchema,
})

/*
    TODO:
        add max limit
        refactor 
        query validation
        add type
*/
export async function getReportsHandler(req: Request, res: Response) {
    const {
        cursor,
        limit = 20,
        barangayId: barangayIds,
        type: hazardTypes,
        status: statuses,
    } = req.query

    const query: any = {}

    if (cursor) {
        query._id = { $lt: new Types.ObjectId(cursor as string) }
    }

    if (barangayIds) {
        query.barangayId = Array.isArray(barangayIds)
            ? { $in: barangayIds }
            : barangayIds
    }

    if (hazardTypes) {
        query.type = Array.isArray(hazardTypes)
            ? { $in: hazardTypes }
            : hazardTypes
    }

    if (statuses) {
        query.status = Array.isArray(statuses) ? { $in: statuses } : statuses
    }

    const reports = await Report.find(query)
        .sort({ _id: -1 })
        .limit(Number(limit))
        .select("-__v")
        .lean()

    const enhancedReports = reports.map((report) => ({
        ...report,
        barangayName: getBarangayName(report.barangayId),
    }))

    const nextCursor =
        reports.length > 0 ? reports[reports.length - 1]._id : null

    res.json({ items: enhancedReports, nextCursor })
}

export async function getClusterReportsHandler(req: Request, res: Response) {
    const { bbox, zoom } = getQuery(req)

    const [minLng, minLat, maxLng, maxLat] = bbox

    const reports = await Report.find({
        location: {
            $geoWithin: {
                $box: [
                    [minLng, minLat],
                    [maxLng, maxLat],
                ],
            },
        },
    })

    const points: Feature<Point>[] = reports.map((report) => {
        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: report.location!.coordinates,
            },
            properties: {
                id: report._id.toString(),
                type: report.type,
            },
        }
    })

    const cluster = new Supercluster({
        radius: 40,
        maxZoom: 18,
    })

    cluster.load(points)

    const clusters = cluster.getClusters(
        bbox as [number, number, number, number],
        zoom
    )

    res.json(clusters)
}

export async function updateReportHandler(req: Request, res: Response) {
    res.json({ message: "update report" })
}
