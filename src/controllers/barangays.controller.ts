import { Request, Response } from "express"

import { readBarangayGeoJSON } from "../services/geojson/readBarangayGeo"

export async function getBarangays(req: Request, res: Response) {
    const geojson = readBarangayGeoJSON()

    const barangays = geojson.features.map((feature) => ({
        id: feature.properties.Brgy_id,
        name: feature.properties.Brgy_Name,
        areaSqKm: feature.properties.AREA_SQKM,
        areaHa: feature.properties.AREA_HA,
    }))

    res.status(200).json(barangays)
}
