import { Router } from "express"
import {
    createReportHandler,
    getReportsHandler,
    updateReportHandler,
} from "../../controllers/reports.controller"
import { asyncHandler } from "../../utils/asyncHandler"

const router = Router()

router.post("/", asyncHandler(createReportHandler))
router.get("/", asyncHandler(getReportsHandler))
router.put("/:id", asyncHandler(updateReportHandler))

export default router
