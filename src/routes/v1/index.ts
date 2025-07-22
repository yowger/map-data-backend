import { Router } from "express"

import reportRoutes from "./reports.routes"
import barangayRoutes from "./barangays.routes"

const router = Router()

router.use("/reports", reportRoutes)
router.use("/barangays", barangayRoutes)

export default router
