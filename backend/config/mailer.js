// src/config/mailer.js
const nodemailer = require("nodemailer");
const { env } = require("./env");

let transporter = null;
if (env.SMTP_EMAIL && env.SMTP_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: env.SMTP_EMAIL, pass: env.SMTP_PASSWORD },
  });
  console.log("📧 Email transport configured.");
} else {
  console.log("⚠️ SMTP credentials not set — email confirmations disabled.");
}

const businessName = env.NEXT_PUBLIC_BUSINESS_NAME || "Our Business";

module.exports = { transporter, businessName };
