import nodemailer from "nodemailer";
import env from "dotenv";

env.config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // The email service's SMTP server
  port: 587,              // SMTP port
  secure: false,          // Use false for port 587
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS,  // Your App Password or Email Password
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

export default transporter;
