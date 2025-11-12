const { db } = require("../../db/pool")

async function healthCheck() {
  const [rows] = await db.query("SELECT 1 AS ok")
  return rows[0]
}

async function getMaxJobId() {
  const [rows] = await db.query("SELECT MAX(jobID) AS maxJobID FROM jobs")
  return rows[0]?.maxJobID ?? null
}

async function reserveJob() {
  const sql = `
    INSERT INTO jobs (CustomerID, DeviceBrand, DeviceType, Issue, DataSave, Password, Status, StartDate)
    VALUES (NULL, NULL, NULL, NULL, NULL, NULL, 'In Progress', NOW())
  `
  const [result] = await db.query(sql)
  return result.insertId
}

async function findCustomer({ firstName, lastName, email }) {
  const [rows] = await db.query(
    "SELECT CustomerID FROM customers WHERE FirstName = ? AND SurName = ? AND Email = ?",
    [firstName, lastName, email]
  )
  return rows[0]?.CustomerID ?? null
}

async function insertCustomer({ firstName, lastName, phone, email, postCode, doorNumber }) {
  const [result] = await db.query(
    "INSERT INTO customers (FirstName, SurName, Phone, Email, PostCode, DoorNumber) VALUES (?, ?, ?, ?, ?, ?)",
    [firstName, lastName, phone, email, postCode, doorNumber]
  )
  return result.insertId
}

async function updateJobWithCustomer(jobID, { customerId, deviceBrand, deviceType, issue, dataSaveValue, password, appleID }) {
  await db.query(
    `UPDATE jobs 
     SET CustomerID = ?, DeviceBrand = ?, DeviceType = ?, Issue = ?, DataSave = ?, Password = ?, AppleId = ?, Status = 'In Progress', StartDate = NOW() 
     WHERE jobID = ?`,
    [customerId, deviceBrand, deviceType, issue, dataSaveValue, password, appleID, jobID]
  )
}

async function insertHowHeard(jobID, howHeard) {
  await db.query("INSERT INTO HowHeard (JobID, HowHeard) VALUES (?, ?)", [jobID, howHeard])
}

async function cancelJob(jobID) {
  const [result] = await db.query(
    `UPDATE jobs
     SET Status = 'Cancelled', EndDate = NOW()
     WHERE JobID = ?
       AND (CustomerID IS NULL)                      -- numeric; reserved rows should be NULL
       AND (NULLIF(DeviceBrand, '') IS NULL)         -- treat '' like NULL
       AND (NULLIF(DeviceType, '') IS NULL)
       AND (NULLIF(Issue, '') IS NULL)`,
    [jobID]
  )
  return result.affectedRows
}


module.exports = {
  healthCheck,
  getMaxJobId,
  reserveJob,
  findCustomer,
  insertCustomer,
  updateJobWithCustomer,
  insertHowHeard,
  cancelJob,
}
