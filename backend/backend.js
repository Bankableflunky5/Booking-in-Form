require("dotenv").config();
requireEnvVars([
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  //"SMTP_EMAIL",
  //"SMTP_PASSWORD",
]);

// Optional: comment this out in production
console.log("🔎 DB_HOST:", process.env.DB_HOST, process.env.DB_USER);

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs"); // ✅ now actually used
const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME;

const app = express();
app.use(express.json());
app.use(cors());

// 🔐 Optional SSL config for DB
const hasSSL =
  process.env.DB_SSL_CA &&
  process.env.DB_SSL_CERT &&
  process.env.DB_SSL_KEY;

let sslConfig = undefined;

if (hasSSL) {
  try {
    sslConfig = {
      ca: fs.readFileSync(process.env.DB_SSL_CA),
      cert: fs.readFileSync(process.env.DB_SSL_CERT),
      key: fs.readFileSync(process.env.DB_SSL_KEY),
      // adjust as needed; many setups are fine with this
      rejectUnauthorized: false,
    };
    console.log("🔐 DB SSL enabled via environment variables.");
  } catch (err) {
    console.error("❌ Failed to read DB SSL files:", err.message);
    console.error("⚠️ Continuing without SSL.");
    sslConfig = undefined;
  }
}

// 🔹 Create DB pool once at startup
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(sslConfig ? { ssl: sslConfig } : {}), // ✅ only added if configured
});


// 🔹 Nodemailer Configuration (optional)
let transporter = null;

if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  console.log("📧 Email transport configured.");
} else {
  console.log("⚠️ SMTP credentials not set — email confirmations disabled.");
}


// (Optional) If you still want an "open-form" endpoint, just use it as a health check
app.post("/api/open-form", async (req, res) => {
  console.log("📌 Received request to open form / health check");

  try {
    const [rows] = await db.promise().query("SELECT 1 AS ok");
    console.log("✅ DB health check OK:", rows[0]);
    res.status(200).json({ message: "Database connection OK" });
  } catch (err) {
    console.error("❌ Database health check failed:", err.message);
    res.status(500).json({ error: "Database connection failed", details: err.message });
  }
});

// 🔹 Fetch Next Job ID (optional)
app.get("/next-job-id", async (req, res) => {
  try {
    const [result] = await db.promise().query(
      "SELECT MAX(jobID) AS maxJobID FROM jobs"
    );
    const maxJobID = result[0].maxJobID;
    const nextJobID = maxJobID ? maxJobID + 1 : 1; // Start from 1, or max + 1
    res.json({ nextJobID });
  } catch (error) {
    console.error("Error fetching next Job ID:", error);
    res.status(500).json({ error: "Failed to fetch Job ID" });
  }
});

// 🔹 Backend API to reserve a Job ID
app.post("/api/reserve-job", async (req, res) => {
  console.log("🔹 Reserve Job API called");

  const reserveJobQuery = `
    INSERT INTO jobs (CustomerID, DeviceBrand, DeviceType, Issue, DataSave, Password, Status, StartDate) 
    VALUES (NULL, NULL, NULL, NULL, NULL, NULL, 'In Progress', NOW())
  `;

  try {
    const [result] = await db.promise().query(reserveJobQuery);
    const jobID = result.insertId;
    console.log(`✅ Reserved Job ID: ${jobID}`);
    res.json({ jobID });
  } catch (err) {
    console.error("❌ Error reserving Job ID:", err);
    res.status(500).json({ error: "Error reserving Job ID" });
  }
});

// 🔹 Handle Form Submission with Reserved Job ID
app.post("/submit", async (req, res) => {
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
  } = req.body;

  console.log("📥 Received submission:", req.body);
  const dataSaveValue = dataSave ? 1 : 0;

  try {
    // Ensure a valid jobID is provided
    if (!jobID) {
      return res.status(400).json({ error: "Job ID is required" });
    }

    // Step 1: Check if the customer exists
    const [customerResults] = await db.promise().query(
      "SELECT CustomerID FROM customers WHERE FirstName = ? AND SurName = ? AND Email = ?",
      [firstName, lastName, email]
    );

    let customerId;

    if (customerResults.length > 0) {
      // ✅ Customer exists
      customerId = customerResults[0].CustomerID;
      console.log(`✅ Existing customer found: CustomerID ${customerId}`);
    } else {
      // 🆕 Customer does NOT exist, insert a new customer
      console.log("🆕 New customer detected. Inserting into database.");

      const [customerInsert] = await db.promise().query(
        "INSERT INTO customers (FirstName, SurName, Phone, Email, PostCode, DoorNumber) VALUES (?, ?, ?, ?, ?, ?)",
        [firstName, lastName, phone, email, postCode, doorNumber]
      );

      customerId = customerInsert.insertId;
      console.log(`✅ New customer added: CustomerID ${customerId}`);
    }

    // Step 2: Update the existing job record using the provided jobID
    await db.promise().query(
      "UPDATE jobs SET CustomerID = ?, DeviceBrand = ?, DeviceType = ?, Issue = ?, DataSave = ?, Password = ?, AppleId = ?, Status = 'In Progress', StartDate = NOW() WHERE jobID = ?",
      [customerId, deviceBrand, deviceType, issue, dataSaveValue, password, appleID, jobID]
    );

    console.log(`✅ Job successfully updated: JobID ${jobID}`);

    // Step 3: Insert howHeard into the HowHeard table
    await db.promise().query(
      "INSERT INTO HowHeard (JobID, HowHeard) VALUES (?, ?)",
      [jobID, howHeard]
    );

    // Send Confirmation Email (fire and forget)
    sendConfirmationEmail(email, firstName, lastName, jobID);

    res.json({
      message:
        "Form submitted successfully! You will receive an email confirmation shortly.",
      jobID,
    });
  } catch (error) {
    console.error("❌ Error in form submission:", error);
    res.status(500).json({
      error: "Error processing form submission",
      details: error.message,
    });
  }
});

// Cancel / unreserve a JobID that was reserved but never submitted
app.post("/api/cancel-job", async (req, res) => {
  const { jobID } = req.body;

  if (!jobID) {
    return res.status(400).json({ error: "Job ID is required" });
  }

  try {
    const [result] = await db.promise().query(
      `
      UPDATE jobs
      SET 
        Status = 'Cancelled',
        EndDate = NOW()
      WHERE JobID = ?
        AND (CustomerID IS NULL OR CustomerID = '')
        AND (DeviceBrand IS NULL OR DeviceBrand = '')
        AND (DeviceType IS NULL OR DeviceType = '')
        AND (Issue IS NULL OR Issue = '')
      `,
      [jobID]
    );

    if (result.affectedRows === 0) {
      console.log(`⚠️ Job ${jobID} not cancelled (already filled or missing)`);
      return res.json({
        message: "Job not cancelled — already used or missing fields",
      });
    }

    console.log(`🟡 Marked JobID ${jobID} as Cancelled (EndDate = NOW())`);
    res.json({ message: "Job cancelled successfully" });
  } catch (err) {
    console.error("❌ Error cancelling job:", err);
    res.status(500).json({ error: "Error cancelling job" });
  }
});



// 🔹 Function to Send Email
function sendConfirmationEmail(email, firstName, lastName, jobId) {
  // 👇 This prevents "Cannot read properties of null (reading 'sendMail')"
  if (!transporter) {
    console.log("⚠️ No SMTP config; skipping email confirmation.");
    return;
  }

  const mailOptions = {
    from: `"${businessName}" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Your Repair Job Confirmation",
    html: `
      <p>Dear ${firstName} ${lastName},</p>
      <p>Thank you for submitting your repair request.</p>
      <p>Your Job ID is: <strong>${jobId}</strong></p>
      <p>We will contact you soon with further details.</p>
      <p>Best regards,</p>
      <p><strong>${businessName}</strong></p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Email sending failed:", error);
    } else {
      console.log("📧 Email sent successfully:", info.response);
    }
  });
}


function requireEnvVars(requiredVars) {
  const missing = requiredVars.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((name) => console.error(`   - ${name}`));
    console.error(
      "\nPlease create a .env file in the backend directory (or set these vars) and restart the server."
    );
    process.exit(1);
  }
}

// 🔹 Start the Backend Server
app.listen(5000, "0.0.0.0", () =>
  console.log("🚀 Server running on http://0.0.0.0:5000")
);
