const express = require('express')

const app = express()
const cors = require('cors');
const port=process.env.PORT || 5000;
require('dotenv').config();
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
//middlewares
app.use(cors());
app.use(express.json());
//users:aakashdixit227
//password:ccHzOmejvym59bSN coonection string:mongodb+srv://aakashdixit227:ccHzOmejvym59bSN@job-portal-back.rmsw7.mongodb.net/?retryWrites=true&w=majority&appName=job-portal-back

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@job-portal-back.rmsw7.mongodb.net/?retryWrites=true&w=majority&appName=job-portal-back`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    //create db
    const db = client.db("mern-job-portal");
    const jobCollection = db.collection("jobs");
    //post a job
    app.post('/post-job',async(req,res)=>{
      console.log("post recieved");
      const body=req.body;
      body.createdAt=new Date();
      const result=await jobCollection.insertOne(body);
      if(result.insertedId){
        return res.status(200).send(result);

      }
      else{
        return res.status(404).send({message:"Internal Server",
          status:false});

      }
    });
    //get all jobs
    app.get('/jobs',async(req,res)=>{
      const jobs=await jobCollection.find({}).toArray();
      res.send(jobs);
    })
    
   
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})