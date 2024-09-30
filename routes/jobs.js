import express from "express";
import Job from "../models/Job.js"; 
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST a new job
router.post("/post-job",authMiddleware, async (req, res) => {
    try {
        console.log(req.body);
        const job = new Job(req.body);
        job.createdAt = new Date();
        const savedJob = await job.save();
        return res.status(200).send(savedJob);
    } catch (error) {
        return res.status(500).send({
            message: "Internal Server Error",
            status: false,
            error: error.message
        });
    }
});

// GET all jobs
router.get("/all-jobs", async (req, res) => {
    try {
        const jobs = await Job.find({});
        res.send(jobs);
    } catch (error) {
        return res.status(500).send({
            message: "Internal Server Error",
            status: false,
            error: error.message
        });
    }
});

// GET jobs posted by a specific user
router.get("/myJobs/:email",authMiddleware, async (req, res) => {
    try {
        const email = req.params.email;
        const jobs = await Job.find({ postedBy: email });
        res.send(jobs);
    } catch (error) {
        return res.status(500).send({
            message: "Internal Server Error",
            status: false,
            error: error.message
        });
    }
});

// DELETE a job
router.delete("/delete-job/:jobId",authMiddleware, async (req, res) => {
    try {
        const id = req.params.jobId;
        const result = await Job.findByIdAndDelete(id);
        if (result) {
            res.status(200).send({ message: "Job deleted successfully" });
        } else {
            res.status(404).send({ message: "Job not found" });
        }
    } catch (error) {
        return res.status(500).send({
            message: "Internal Server Error",
            status: false,
            error: error.message
        });
    }
});

// EDIT a job
router.put("/edit-job/:jobId",authMiddleware, async (req, res) => {
    try {
        const id = req.params.jobId;
        const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
        if (updatedJob) {
            res.status(200).send({ message: "Job updated successfully", updatedJob });
        } else {
            res.status(404).send({ message: "Job not found" });
        }
    } catch (error) {
        return res.status(500).send({
            message: "Internal Server Error",
            status: false,
            error: error.message
        });
    }
});

export default router;
