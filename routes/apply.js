import express from "express";
import multer from "multer"; // for handling file uploads
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

// Configure Multer for file uploads (e.g., resume PDFs)
// Configure Multer to store file in memory
const storage = multer.memoryStorage(); // Store file in memory (Buffer)
const upload = multer({ storage: storage });

// // Apply for a job
// router.post("/apply/:jobId", upload.single('resume'), async (req, res) => {
//     try {
//         const { name, email, phone } = req.body;
//         console.log(name, email, phone);
//         const applicantName = name;
//         const applicantEmail = email;
//         const applicantPhone = phone;
//         const jobId = req.params.jobId;

//         const application = new Application({
//             jobId,
//             applicantName,
//             applicantEmail,
//             applicantPhone,
//             resume: req.file.path, // store the uploaded resume path
//         });
//         console.log(application);

//         const savedApplication = await application.save();
//         res.status(200).send({ message: "Application submitted successfully", savedApplication });
//     } catch (error) {
//         return res.status(500).send({
//             message: "Internal Server Error",
//             status: false,
//             error: error.message
//         });
//     }
// });
// Apply for a job
router.post("/apply/:jobId", upload.single('resume'), async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const jobId = req.params.jobId;

        // Access the uploaded file's buffer (binary data)
        const resumeFileBuffer = req.file.buffer;

        // Create a new job application
        const application = new Application({
            jobId,
            applicantName: name,
            applicantEmail: email,
            applicantPhone: phone,
            resume: resumeFileBuffer, // store the file binary data (Buffer)
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

// // Retrieve jobs that a specific user has applied for
// router.get("/my-applications/:email",authMiddleware, async (req, res) => {
//     try {
//         const email = req.params.email;
//         const applications = await Application.find({ applicantEmail: email }).populate('jobId');
//         res.status(200).send(applications);
//     } catch (error) {
//         return res.status(500).send({
//             message: "Internal Server Error",
//             status: false,
//             error: error.message
//         });
//     }
// });
// Get applications for a specific user by email, including job details
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
