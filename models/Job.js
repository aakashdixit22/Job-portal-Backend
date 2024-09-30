import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  minPrice: {
    type: String,
    required: true,
  },
  maxPrice: {
    type: String,
    required: true,
  },
  salaryType: {
    type: String,
    required: true,
  },
  jobLocation: {
    type: String,
    required: true,
  },
  postingDate: {
    type: Date,
    default: Date.now,
  },
  experienceLevel: {
    type: String,
    required: true,
  },
  companyLogo: {
    type: String,
    required: true,
  },
  employmentType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  postedBy: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
