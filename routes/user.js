import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { Game } from "./game.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nums = [
  314651, 521236, 345431, 514216, 421361, 333633, 566322, 414143, 464212,
  633136, 311362, 623162, 263516, 626341, 445265, 364351, 611436, 643161,
  114441, 612524, 225164, 356314, 435111, 455361, 114151, 124354, 515443,
  625256, 413411, 153155,
];

let userId = "";
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.json({ message: "user already existed" });
  }

  const hashpassword = await bcrypt.hash(password, 10);
  const i = await User.countDocuments();
  const newUser = new User({
    username,
    email,
    password: hashpassword,
    vaultPassword: nums[i],
    src: i,
    pic: [i - 1],
  });
  const firstUser = await User.findOne().sort({ _id: 1 });

  if (firstUser) {
    await User.findByIdAndUpdate(firstUser._id, { pic: [i] });
  }
  const savedUser = await newUser.save();
  if (!savedUser) {
    return res.json({ status: false, message: "record not registered" });
  }
  if (i == 0) {
    userId = savedUser._id;
  }
  return res.json({ status: true, message: "record registered" });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user is not registered" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "password is incorrect" });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "36h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.json({ status: true, message: "login successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "user not registered" });
    }
    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "5m",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saketh.pallempati@gmail.com",
        pass: process.env.NODEMAIL,
      },
    });
    const encodedToken = encodeURIComponent(token).replace(/\./g, "%2E");
    var mailOptions = {
      from: "saketh.pallempati@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `http://localhost:5173/resetPassword/${encodedToken}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ message: "error sending email" });
      } else {
        return res.json({ status: true, message: "email sent" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = await jwt.verify(token, process.env.KEY);
    const id = decoded.id;
    const hashPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate({ _id: id }, { password: hashPassword });
    return res.json({ status: true, message: "updated password" });
  } catch (err) {
    return res.json("invalid token");
  }
});
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: true });
});

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "no token" });
    }
    const decoded = await jwt.verify(token, process.env.KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.json({ status: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.json(err);
  }
};

router.get("/verify", verifyUser, (req, res) => {
  let user = req.user.toObject();
  delete user.password;
  delete user.vaultPassword;
  return res.json({ status: true, message: "authorized", user: user });
});

router.get("/vaultImg", (req, res) => {
  console.log(req.query.id);
  res.sendFile(path.join(__dirname, "../public/" + req.query.id + ".jpg"));
});
router.get("/leaderboard", (req, res) => {
  User.aggregate([
    {
      $project: {
        username: 1,
        numberOfElements: { $size: "$pic" }
      }
    },
    {
      $sort: { numberOfElements: -1 }
    }
  ])
  .then((users) => {
    return res.json(users);
  })
  .catch((err) => {
    return res.status(500).json({ message: "An error occurred", error: err });
  });
});
router.use("/game", verifyUser, Game);

export { router as UserRouter };
