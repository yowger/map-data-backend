import fs from "fs"
import path from "path"
import type { FeatureCollection } from "geojson"

const BARANGAY_DIR = "../../data/barangays.geojson"

export function readBarangayGeoJSON(): FeatureCollection {
    const filePath = path.join(__dirname, BARANGAY_DIR)
    const raw = fs.readFileSync(filePath, "utf-8")
    const json = JSON.parse(raw)

    return json
}

export const barangayGeoJson = readBarangayGeoJSON()

export const barangaysList = barangayGeoJson.features.map((feature) => ({
    id: feature.properties.Brgy_id,
    name: feature.properties.Brgy_Name,
    areaSqKm: feature.properties.AREA_SQKM,
    areaHa: feature.properties.AREA_HA,
}))
