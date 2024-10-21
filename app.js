import express from "express";
import cors from "cors";
import dbConnection from "./config/db.js";
import jobRoutes from "./routes/jobs.js";
import emailRoutes from "./routes/email.js";
import authRoutes from "./routes/auth.js";
import jobApplyRoutes from "./routes/apply.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/jobs", jobRoutes);
app.use("/api/subscribers", emailRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobApply", jobApplyRoutes);



dbConnection();

app.get("/", (req, res) => {
    res.send("Welcome to the Job Portal API");
    });








const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
