import { faker } from "@faker-js/faker"
import bbox from "@turf/bbox"

import database from "../services/mongoose/mongoose"
import Report from "../services/mongoose/models/reports.model"
import User from "../services/mongoose/models/users.model"
import { readBarangayGeoJSON } from "../services/geojson/barangayUtils"
import { getRandomPointInPolygon } from "../services/turf/turf.services"

const chance = 0.4

const categories = [
    "Flood",
    "Landslide",
    "Garbage",
    "Road Damage",
    "Blocked Drainage",
    "Power Outage",
    "Missing Person",
    "Missing Animal",
    "Missing Vehicle",
    "Missing Object",
    "Other",
]

async function seedReports() {
    await database.connect()

    const users = await User.find({})
    const moderator = users.find((u) => u.role === "moderator")

    const barangays = readBarangayGeoJSON()

    const reports = []

    for (const barangay of barangays.features) {
        const polygon = barangay.geometry
        const boundingBox = bbox(barangay) as [number, number, number, number]

        const reportsCount = faker.number.int({ min: 0, max: 20 })

        for (let i = 0; i < reportsCount; i++) {
            const point = getRandomPointInPolygon(polygon, boundingBox)
            const type = faker.helpers.arrayElement(categories)

            const imageUrls = Array.from({
                length: faker.number.int({ min: 0, max: 4 }),
            }).map(() =>
                faker.image.urlPicsumPhotos({
                    width: 640,
                    height: 480,
                })
            )

            const isVerified = Math.random() < chance
            const verifiedInfo =
                isVerified && moderator
                    ? {
                          verifiedBy: moderator._id,
                          verifiedAt: faker.date.recent({ days: 7 }),
                      }
                    : undefined

            reports.push({
                type,
                message: faker.lorem.sentence(),
                imageUrls,
                lat: point.lat,
                lng: point.lng,
                authorId: faker.helpers.arrayElement(users)._id,
                barangayId: barangay.properties.Brgy_id,
                location: {
                    type: "Point",
                    coordinates: [point.lng, point.lat],
                },
                status: isVerified ? "verified" : "pending",
                verifiedInfo,
            })
        }
    }

    await Report.deleteMany({})
    await Report.insertMany(reports)

    console.log(`Seeded ${reports.length} reports.`)
    await database.disconnect()
}

seedReports().catch((err) => {
    console.error("Error seeding reports:", err)

    database.disconnect()
})
