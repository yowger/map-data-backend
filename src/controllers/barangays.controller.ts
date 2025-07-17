import { Request, Response } from "express"

import { barangaysList } from "../services/geojson/readBarangayGeo"

export async function getBarangays(req: Request, res: Response) {
    res.status(200).json(barangaysList)
}
