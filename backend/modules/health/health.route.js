const { Router } = require("express")
const { asyncHandler } = require("../../middleware/asyncHandler")
const repo = require("../jobs/jobs.repo")

const router = Router()
router.post("/open-form", asyncHandler(async (_req, res) => {
  const row = await repo.healthCheck()
  res.status(200).json({ message: "Database connection OK", row })
}))

module.exports = router
