// src/index.js
require("dotenv").config()
const { env } = require("./config/env")
const { app } = require("./app")

const host = "0.0.0.0"
app.listen(env.PORT, host, () => {
  console.log(`🚀 Server running on http://${host}:${env.PORT}`)
})
