import fs from "fs"
import path from "path"
import type { FeatureCollection } from "geojson"

export function readBarangayGeoJSON(): FeatureCollection {
    const filePath = path.join(__dirname, "../../data/barangays.geojson")
    const raw = fs.readFileSync(filePath, "utf-8")
    const json = JSON.parse(raw)

    return json
}
