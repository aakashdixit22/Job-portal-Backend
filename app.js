import express from "express";
import { connectToDb, getDb } from "./db.js";
import cors from "cors";
import { ObjectId } from "mongodb";
import axios from "axios";
import cron from "node-cron";
import dotenv from "dotenv";
import transporter from "./transporter.js";// Import the transporter

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Database collections
let db;
let jobCollection;
let subscriberCollection;

// Database connection
connectToDb((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
    db = getDb();
    jobCollection = db.collection("jobs");
    subscriberCollection = db.collection("subscribers");
  } else {
    console.log("Error connecting to the database");
  }
});

// Health Check Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// -------------------- Job-Related Endpoints --------------------

// POST a job
app.post("/post-job", async (req, res) => {
  const body = req.body;
  body.createdAt = new Date();
  const result = await jobCollection.insertOne(body);
  if (result.insertedId) {
    return res.status(200).send(result);
  } else {
    return res.status(500).send({
      message: "Internal Server Error",
      status: false,
    });
  }
});

// GET all jobs
app.get("/all-jobs", async (req, res) => {
  const jobs = await jobCollection.find({}).toArray();
  res.send(jobs);
});

// GET jobs posted by a specific user
app.get("/myJobs/:email", async (req, res) => {
  const email = req.params.email;
  const jobs = await jobCollection.find({ postedBy: email }).toArray();
  res.send(jobs);
});

// DELETE a job
app.delete("/delete-job/:jobId", async (req, res) => {
  const id = req.params.jobId;
  const result = await jobCollection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 1) {
    res.status(200).send({ message: "Job deleted successfully" });
  } else {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// EDIT a job
app.put("/edit-job/:jobId", async (req, res) => {
  const id = req.params.jobId;
  const body = req.body;
  const result = await jobCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: body }
  );
  if (result.modifiedCount === 1) {
    res.status(200).send({ message: "Job updated successfully" });
  } else {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Fetching the news using News API via Axios
app.get("/news", async (req, res) => {
  try {
    const news = await axios.get(
      `https://newsapi.org/v2/everything?q=jobs&apiKey=${process.env.NEWS_API_KEY}`
    );
    res.send(news.data);
  } catch (error) {
    console.error("Error fetching news:", error.response?.data || error.message);
    res.status(500).send({ message: "Error fetching news data." });
  }
});

// -------------------- Email Subscription Endpoints --------------------

// POST /subscribe - Subscribe an email
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email address." });
  }

  try {
    // Check if the email is already subscribed
    const existingSubscriber = await subscriberCollection.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ success: false, message: "Email is already subscribed." });
    }

    // Insert the new subscriber
    const result = await subscriberCollection.insertOne({
      email,
      subscribedAt: new Date(),
    });

    if (result.insertedId) {
      // Send confirmation email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Subscription Confirmation",
        html: `<h1>Welcome!</h1><p>Thank you for subscribing to our daily jobs and news updates!</p>`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent to ${email}`);

      return res.status(200).json({ success: true, message: "Subscribed successfully!" });
    } else {
      return res.status(500).json({ success: false, message: "Failed to subscribe." });
    }
  } catch (error) {
    console.error("Error subscribing email:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error." });
  }
});

// -------------------- Email Sending Functionality --------------------

// Function to fetch latest jobs and news
const fetchLatestContent = async () => {
  try {
    // Fetch latest jobs from your own database
    const latestJobs = await jobCollection.find({}).sort({ createdAt: -1 }).limit(5).toArray();
    console.log(latestJobs)

    // Fetch latest news from News API
    const newsResponse = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${process.env.NEWS_API_KEY}`
    );
    const latestNews = newsResponse.data.articles.slice(0, 5); // Get top 5 news articles

    return { latestJobs, latestNews };
  } catch (error) {
    console.error("Error fetching latest content:", error.response?.data || error.message);
    return { latestJobs: [], latestNews: [] };
  }
};

// Function to send daily emails to all subscribers
const sendDailyEmails = async () => {
  try {
    const subscribers = await subscriberCollection.find({}).toArray();
    if (subscribers.length === 0) {
      console.log("No subscribers to send emails to.");
      return;
    }

    const { latestJobs, latestNews } = await fetchLatestContent();

    // Construct email content
    let emailContent = `
      <h1>Daily Jobs and News Update</h1>
      <h2>Latest Jobs</h2>
      <ul>
    `;
    latestJobs.forEach((job) => {
      emailContent += `
        <li>
          <strong>${job.jobTitle}</strong> at ${job.companyName} - <a href="${job.applyLink}" target="_blank">Apply Here</a>
          <br>Location: ${job.jobLocation}
          <br>Salary: ${job.minPrice} - ${job.maxPrice} (${job.salaryType})
          <br>Experience Level: ${job.experienceLevel}
          <br>Employment Type: ${job.employmentType}
          <br>Description: ${job.description}
          <br>Skills: ${job.skills.map(skill => skill.label).join(', ')}
          <br><img src="${job.companyLogo}" alt="${job.companyName} Logo" width="100">
        </li>
      `;
    });
    emailContent += `</ul>`;

    emailContent += `
      <h2>Latest News</h2>
      <ul>
    `;
    latestNews.forEach((article) => {
      emailContent += `
        <li>
          <a href="${article.url}" target="_blank">${article.title}</a>
          <br><img src="${article.urlToImage}" alt="${article.title}" width="100">
        </li>
      `;
    });
    emailContent += `</ul>`;

    // Send email to each subscriber
    for (const subscriber of subscribers) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: subscriber.email,
        subject: "Your Daily Jobs and News Update",
        html: emailContent,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${subscriber.email}`);
      } catch (error) {
        console.error(`Error sending email to ${subscriber.email}:`, error);
        console.error("Detailed error info:", error.response ? error.response.data : error);
      }
    }
  } catch (error) {
    console.error("Error in sendDailyEmails:", error);
  }
};

cron.schedule("52 12 * * *", () => {
  console.log("Running daily email job at 12:42 PM");
  sendDailyEmails();
});
