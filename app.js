import express from "express";
import { connectToDb, getDb } from "./db.js";
import cors from "cors";
import { ObjectId } from "mongodb";

const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());

let db;
let jobCollection;
// db connection
connectToDb((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`app listening on ${port}`);
    });
    db = getDb();
    jobCollection = db.collection("jobs");
  } else {
    console.log("Error connecting to the database");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// POST a job
app.post("/post-job", async (req, res) => {
  const body = req.body;
  console.log("Post received");
  console.log(body);
  body.createdAt = new Date();
  const result = await jobCollection.insertOne(body);
  if (result.insertedId) {
    return res.status(200).send(result);
  } else {
    return res.status(404).send({
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

app.get("/myJobs/:email", async (req, res) => {
  const email = req.params.email;
  const jobs = await jobCollection.find({ postedBy: email }).toArray();
  res.send(jobs);
});
//delete the job
app.delete("/delete-job/:jobId", async (req, res) => {
  const id = req.params.jobId;
  const result = await db
    .collection("jobs")
    .deleteOne({ _id: new ObjectId(id) });
  if (result) {
    res.status(200).send({ message: "Job deleted successfully" });
  } else {
    res.status(404).send({ message: "Internal Server Error" });
  }
});

// edit the job
app.put("/edit-job/:jobId", async (req, res) => {
  const id = req.params.jobId;
  const body = req.body;
  const result = await db
    .collection("jobs")
    .updateOne({ _id: new ObjectId(id) }, { $set: body });
  if (result) {
    res.status(200).send({ message: "Job updated successfully" });
  } else {
    res.status(404).send({ message: "Internal Server Error" });
  }
});
