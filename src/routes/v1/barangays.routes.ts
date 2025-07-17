import { Router } from "express"
import {
    getBarangays,
    getBarangaysWithReports,
} from "../../controllers/barangays.controller"
import { asyncHandler } from "../../utils/asyncHandler"

const router = Router()

router.get("/", asyncHandler(getBarangays))
router.get("/with-reports", asyncHandler(getBarangaysWithReports))

export default router
