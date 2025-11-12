const { Router } = require("express");
const { asyncHandler } = require("../../middleware/asyncHandler");
const ctrl = require("./jobs.controller");

const router = Router();
router.get("/next-job-id", asyncHandler(ctrl.getNextJobId));
router.post("/reserve-job", asyncHandler(ctrl.reserveJob));
router.post("/submit", asyncHandler(ctrl.submit));
router.post("/cancel-job", asyncHandler(ctrl.cancelJob));
router.post("/cancel-job/:jobID", asyncHandler(ctrl.cancelJob)); // accept path param too

module.exports = router;
