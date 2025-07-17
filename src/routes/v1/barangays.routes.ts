import { Router } from "express"
import { getBarangays } from "../../controllers/barangays.controller"
import { asyncHandler } from "../../utils/asyncHandler"

const router = Router()

router.get("/", asyncHandler(getBarangays))

export default router
