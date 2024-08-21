import dotenv from "dotenv";
dotenv.config();
import express from "express"; // Import express
import bodyParser from "body-parser";
import mongodb from "mongodb";
import cors from "cors"; // Use import for cors as well
import ReviewsDAO from "./dao/reviewsDAO.js";
import app from "./server.js";

const MongoClient = mongodb.MongoClient;
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const encodedPassword = encodeURIComponent(mongoPassword);

const uri = `mongodb+srv://${mongoUsername}:${encodedPassword}@cluster0.e2myved.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const port = process.env.PORT || 3000;

app.use(cors({
  origin: ['https://movie-reviwer-frontend.vercel.app'],
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());
app.use(bodyParser.json());

MongoClient.connect(uri, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
})
  .catch((err) => {
    console.error('MongoDB connection error:', err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await ReviewsDAO.injectDB(client);
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  });
