import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();
import { UserRouter } from "./routes/user.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(cookieParser());
app.use("/", UserRouter);

mongoose.connect(process.env.MONGO);

app.listen(process.env.PORT, () => {
  console.log("Server is running at http://localhost:" + process.env.PORT);
});
