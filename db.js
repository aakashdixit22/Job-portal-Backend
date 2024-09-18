import { MongoClient } from "mongodb";
import env from "dotenv"
let dbConnection;
env.config()

// const url = process.env.MONGO_URL;
const url = "mongodb://localhost:27017/"
export async function connectToDb(cb) {
    try {
        const client = await MongoClient.connect(url);
        dbConnection = client.db('mern-job-portal');
        console.log("Connected to the database");
        return cb();
    } catch (err) {
        console.error("Error connecting to the database:", err);
        return cb(err);
    }
}
export function getDb(){
    return dbConnection;
}