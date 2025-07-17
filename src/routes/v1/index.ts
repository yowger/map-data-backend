import { Router } from "express"

import reportRoutes from "./reports.routes"
import barangayRouters from "./barangays.routes"

const router = Router()

router.use("/reports", reportRoutes)
router.use("/barangays", barangayRouters)

export default router
