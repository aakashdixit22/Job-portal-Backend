import express from "express";
import cors from "cors";
import dbConnection from "./config/db.js";
import jobRoutes from "./routes/jobs.js";
import emailRoutes from "./routes/email.js";
import authRoutes from "./routes/auth.js";
import jobApplyRoutes from "./routes/apply.js";
import newsRoutes from "./routes/news.js";
import contactRoutes from "./routes/contact.js";
import cron from "node-cron";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/jobs", jobRoutes);
app.use("/api/subscribers", emailRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobApply", jobApplyRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/contact", contactRoutes);

// DB connection
dbConnection();

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Job Portal API");
});

// Keep-Alive Route
app.get("/api/keepalive", (req, res) => {
    console.log("Server is alive!");
    res.status(200).send("Server is alive!");
});

// Cron job to ping the keepalive route every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  try {
    console.log("Pinging /api/keepalive to keep the server alive...");
    const response = await axios.get(`${process.env.BACKEND_URL}/api/keepalive`); 
    console.log("Response from /api/keepalive:", response.data);
  } catch (error) {
    console.error("Error while pinging /api/keepalive:", error.message);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
