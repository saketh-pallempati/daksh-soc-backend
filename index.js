import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserRouter } from "./routes/user.js";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();
const app = express();
const httpServer = createServer(app);
global.io = new Server(httpServer, {
  cors: {
    origin: 'https://daksh-leaderboard.vercel.app',
    methods : ["GET", "POST"]
  }
});

app.use(express.json());
app.use(express.static("public"));
app.use(
  cors({
    origin: [
      "https://daksh-soc-terminal.vercel.app",
      "https://daksh-soc-2024.vercel.app",
      "https://daksh-leaderboard.vercel.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/", UserRouter);
app.get("/", (req, res) => {
  res.send("Home");
});
mongoose.connect(process.env.MONGO);

httpServer.listen(process.env.PORT, () => {
  console.log("Server is running at http://localhost:" + process.env.PORT);
});
