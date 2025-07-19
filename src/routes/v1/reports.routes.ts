import { Router } from "express"
import {
    createReportHandler,
    getClusterReportsHandler,
    getReportsHandler,
    updateReportHandler,
} from "../../controllers/reports.controller"
import { asyncHandler } from "../../utils/asyncHandler"

const router = Router()

router.post("/", asyncHandler(createReportHandler))
router.get("/", asyncHandler(getReportsHandler))
router.get("/clusters", asyncHandler(getClusterReportsHandler))
router.put("/:id", asyncHandler(updateReportHandler))

export default router
