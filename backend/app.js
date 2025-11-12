// src/app.js
const express = require("express")
const cors = require("cors")
const jobsRouter = require("./modules/jobs/jobs.route")
const healthRouter = require("./modules/health/health.route")
const { errorHandler } = require("./middleware/error")

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api", healthRouter) // /api/open-form
app.use("/api", jobsRouter)   // /api/next-job-id, /api/reserve-job, /api/submit, /api/cancel-job

app.use(errorHandler)
module.exports = { app }
