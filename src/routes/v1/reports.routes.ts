import { Router } from "express"
import {
    createReportHandler,
    getReport,
    getReports,
    updateReport,
} from "../../controllers/reports.controller"
import { asyncHandler } from "../../utils/asyncHandler"

const router = Router()

router.post("/", asyncHandler(createReportHandler))
router.get("/", asyncHandler(getReport))
router.put("/:id", asyncHandler(updateReport))

export default router
