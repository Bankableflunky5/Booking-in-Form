const svc = require("./jobs.service")
const { transporter, businessName } = require("../../config/mailer")

async function getNextJobId(_req, res) {
  const next = await svc.nextJobId()
  res.json({ nextJobID: next })
}

async function reserveJob(_req, res) {
  const jobID = await svc.reserve()
  res.json({ jobID })
}

async function submit(req, res) {
  const result = await svc.submit(req.body)

  // fire-and-forget email
  if (transporter && req.body.email) {
    const { firstName, lastName, email } = req.body
    const mailOptions = {
      from: `"${businessName}" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Your Repair Job Confirmation",
      html: `
        <p>Dear ${firstName} ${lastName},</p>
        <p>Thank you for submitting your repair request.</p>
        <p>Your Job ID is: <strong>${result.jobID}</strong></p>
        <p>Best regards,<br/><strong>${businessName}</strong></p>
      `,
    }
    transporter.sendMail(mailOptions).catch(err =>
      console.error("❌ Email sending failed:", err.message)
    )
  }

  res.json({
    message: "Form submitted successfully! You will receive an email confirmation shortly.",
    jobID: result.jobID,
  })
}

async function cancelJob(req, res) {
  // Accept body.jobID, JobID, query, or :jobID
  const raw =
    req.body?.jobID ?? req.body?.JobID ??
    req.query?.jobID ?? req.query?.JobID ??
    req.params?.jobID

  const jobID = Number(raw)
  console.log("[cancel-job] incoming", { body: req.body, params: req.params, query: req.query, jobID })

  if (!Number.isInteger(jobID) || jobID <= 0) {
    return res.status(400).json({ error: "Job ID is required" })
  }

  const ok = await svc.cancel(jobID)
  if (!ok) {
    return res.json({ message: "Job not cancelled — already used or missing fields" })
  }
  res.json({ message: "Job cancelled successfully" })
}


module.exports = { getNextJobId, reserveJob, submit, cancelJob }
