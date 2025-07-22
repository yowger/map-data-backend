export type ReportSummary = {
    _id: string
    barangayId: string
    type: string
    status: "pending" | "verified" | "rejected" | "archived"
    createdAt: string
}

export type Barangay = {
    id: string
    name: string
}

export type BarangayWithAreas = {
    areaSqKm: number
    areaHa: number
} & Barangay

export type BarangayWithReports = BarangayWithAreas & {
    recentReports: ReportSummary[]
}

export type BarangayWithReportsList = BarangayWithReports[]
