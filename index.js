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
    origin: [
      "https://daksh-soc-2024.vercel.app",
      "https://daksh-soc-terminal.vercel.app/",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/", UserRouter);

mongoose.connect(process.env.MONGO);

app.listen(process.env.PORT, () => {
  console.log("Server is running at http://localhost:" + process.env.PORT);
});
