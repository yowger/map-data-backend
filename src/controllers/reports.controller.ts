import { Request, Response } from "express"

export async function createReport(req: Request, res: Response) {
    res.json({ message: "create report" })
}

export async function getReport(req: Request, res: Response) {
    res.json({ message: "get reports" })
}

export async function getReports(req: Request, res: Response) {
    res.json({ message: "get report" })
}

export async function updateReport(req: Request, res: Response) {
    res.json({ message: "update report" })
}
