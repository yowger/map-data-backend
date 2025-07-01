import { Router } from "express"

import reportRoutes from "./reports.routes"

const router = Router()

router.use("/reports", reportRoutes)

export default router
