import express from "express";
import multer from "multer"; // for handling file uploads
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();


const storage = multer.memoryStorage(); // Store file in memory (Buffer)
const upload = multer({ storage: storage });

router.post("/apply/:jobId", upload.single('resume'), async (req, res) => {
    try {
        const { name, email, phone, coverLetter } = req.body;
        const jobId = req.params.jobId;
        console.log(name, email, phone, coverLetter);
        // Access the uploaded file's buffer (binary data)
        const resumeFileBuffer = req.file.buffer;

        // Create a new job application
        const application = new Application({
            jobId,
            applicantName: name,
            applicantEmail: email,
            applicantPhone: phone,
            resume: resumeFileBuffer, // store the file binary data (Buffer)
            coverLetter:coverLetter// store the cover letter text
        });

        const savedApplication = await application.save();
        res.status(200).send({ message: "Application submitted successfully", savedApplication });
    } catch (error) {
        return res.status(500).send({
            message: "Internal Server Error",
            status: false,
            error: error.message
        });
    }
});

router.get("/my-applications/:email", async (req, res) => {
    try {
        const { email } = req.params;

        // Fetch applications based on applicant email and populate job details
        const applications = await Application.find({ applicantEmail: email })
            .populate({
                path: 'jobId', // Reference to the Job model
                select: 'jobTitle companyName minPrice maxPrice jobLocation description employmentType', // Select fields you want
            });

        if (!applications || applications.length === 0) {
            return res.status(404).send({
                message: "No applications found",
                status: false
            });
        }

        res.status(200).send({ applications });
    } catch (error) {
        res.status(500).send({
            message: "Error fetching applications",
            status: false,
            error: error.message
        });
    }
});


// Retrieve applicants for a job posted by a user
router.get("/applicants/:jobId",authMiddleware, async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).send({ message: "Job not found" });
        }

        

        const applicants = await Application.find({ jobId });
        res.status(200).send(applicants);
    } catch (error) {
        return res.status(500).send({
            message: "Internal Server Error",
            status: false,
            error: error.message
        });
    }
});

export default router;
