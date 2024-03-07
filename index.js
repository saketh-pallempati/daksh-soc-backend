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
    origin: ["http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);
app.use(cookieParser());
app.use("/", UserRouter);

mongoose.connect(process.env.MONGO);

app.listen(process.env.PORT, () => {
  console.log("Server is running at http://localhost:" + process.env.PORT);
});
