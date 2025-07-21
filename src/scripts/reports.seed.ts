import { faker } from "@faker-js/faker"
import bbox from "@turf/bbox"

import database from "../services/mongoose/mongoose"
import Report from "../services/mongoose/models/reports.model"
import User from "../services/mongoose/models/users.model"
import { readBarangayGeoJSON } from "../services/geojson/barangayUtils"
import { getRandomPointInPolygon } from "../services/turf/turf.services"

const VERIFIED_CHANCE = 0.4

const EVENT_CATEGORIES = [
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
            const randomPoint = getRandomPointInPolygon(polygon, boundingBox)
            const randomType = faker.helpers.arrayElement(EVENT_CATEGORIES)

            const imageUrls = Array.from({
                length: faker.number.int({ min: 0, max: 4 }),
            }).map(() =>
                faker.image.urlPicsumPhotos({
                    width: 640,
                    height: 480,
                })
            )

            const isVerified = Math.random() < VERIFIED_CHANCE
            const verifiedInfo =
                isVerified && moderator
                    ? {
                          verifiedBy: moderator._id,
                          verifiedAt: faker.date.recent({ days: 7 }),
                      }
                    : undefined

            reports.push({
                title: faker.lorem.words({ min: 3, max: 7 }),
                description: faker.lorem.paragraphs({ min: 1, max: 3 }),
                type: randomType,
                message: faker.lorem.sentence(),
                imageUrls,
                lat: randomPoint.lat,
                lng: randomPoint.lng,
                author: faker.helpers.arrayElement(users)._id,
                barangayId: barangay.properties.Brgy_id,
                location: {
                    type: "Point",
                    coordinates: [randomPoint.lng, randomPoint.lat],
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
