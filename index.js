const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("../backend/functions/routes/userRouter");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection

const MONGODB_URI =
  "mongodb+srv://Hatid:Hatid@cluster0.cg2euxr.mongodb.net/Hatid?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// Routes
app.use("/.netlify/functions/app", userRoutes);
module.exports.handler = serverless(app);
