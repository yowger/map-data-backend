import { randomPoint } from "@turf/random"
import booleanPointInPolygon from "@turf/boolean-point-in-polygon"
import type { Feature, Point, Geometry } from "geojson"

export function getRandomPointInPolygon(
    geometry: Geometry,
    bbox: [number, number, number, number]
): { lat: number; lng: number } {
    if (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon") {
        throw new Error("Geometry must be a Polygon or MultiPolygon")
    }

    let pt: Feature<Point>
    let attempts = 0

    do {
        pt = randomPoint(1, { bbox }).features[0]
        attempts++

        if (attempts > 50) {
            throw new Error("Failed to find point inside polygon")
        }
    } while (
        !booleanPointInPolygon(pt, {
            type: "Feature",
            geometry,
            properties: {},
        })
    )

    const [lng, lat] = pt.geometry.coordinates

    return { lat, lng }
}
