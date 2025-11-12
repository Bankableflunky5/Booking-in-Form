const repo = require("./jobs.repo")

async function nextJobId() {
  const max = await repo.getMaxJobId()
  return (max ?? 0) + 1
}

async function reserve() {
  return repo.reserveJob()
}

async function submit(payload) {
  const {
    jobID,
    firstName,
    lastName,
    phone,
    email,
    doorNumber,
    postCode,
    howHeard,
    deviceType,
    deviceBrand,
    issue,
    password,
    dataSave,
    appleID,
  } = payload

  if (!jobID) throw { status: 400, message: "Job ID is required" }

  let customerId = await repo.findCustomer({ firstName, lastName, email })
  if (!customerId) {
    customerId = await repo.insertCustomer({ firstName, lastName, phone, email, postCode, doorNumber })
  }

  const dataSaveValue = dataSave ? 1 : 0

  await repo.updateJobWithCustomer(jobID, {
    customerId,
    deviceBrand,
    deviceType,
    issue,
    dataSaveValue,
    password,
    appleID,
  })

  await repo.insertHowHeard(jobID, howHeard)

  return { jobID, customerId }
}

async function cancel(jobID) {
  if (!jobID) throw { status: 400, message: "Job ID is required" }
  const affected = await repo.cancelJob(jobID)
  return affected > 0
}

module.exports = { nextJobId, reserve, submit, cancel }
