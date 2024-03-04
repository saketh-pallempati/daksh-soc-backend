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
    origin : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/", UserRouter);

mongoose.connect("mongodb://127.0.0.1:27017/authentication");

app.listen(process.env.PORT, () => {
  console.log("Server is running at http://localhost:" + process.env.PORT);
});
