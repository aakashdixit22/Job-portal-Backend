// import mongoose from 'mongoose';

// const applicationSchema = new mongoose.Schema({
//   jobId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Job',
//     required: true
//   },
//   applicantName: {
//     type: String,
//     required: true
//   },
//   applicantEmail: {
//     type: String,
//     required: true
//   },
//   applicantPhone: {
//     type: String,
//     required: true
//   },
//   resume: {
//     type: Buffer, // Store the resume as binary data (BLOB)
//     required: true
//   },
//   appliedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Application = mongoose.model('Application', applicationSchema);
// export default Application;
import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicantName: {
    type: String,
    required: true
  },
  applicantEmail: {
    type: String,
    required: true
  },
  applicantPhone: {
    type: String,
    required: true
  },
  resume: {
    type: Buffer, // Store the resume as binary data (BLOB)
    required: true
  },
  coverLetter: {
    type: String, // Store the cover letter text
    required: true // Make this required, or adjust based on your use case
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;
