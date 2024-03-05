import express from "express";
const router = express.Router();
import { User } from "../models/User.js";
import prompt from "prompt";
import path from "path";
function getInput() {
  prompt.start();

  return new Promise((resolve, reject) => {
    prompt.get(["number"], function (err, result) {
      if (err) {
        reject(err);
      }
      const num = parseInt(result.number);
      if (num === 1 || num === 0) {
        console.log(`You entered ${num}`);
        resolve(num);
      } else {
        console.log("Invalid input. Please enter 1 or 0.");
        resolve(getInput());
      }
    });
  });
}
router.post("/message", (req, res) => {
  const { message } = req.body;
  console.log(message);
  res.json({ message: "Message received" });
});

router.post("/check", async (req, res) => {
  const { comment } = req.body;
  console.log(comment);
  let x = await getInput();
  if (x === 1) {
    return res.json({ flag: true });
  }
  return res.json({ flag: false });
});

router.get("/query", (req, res) => {
  const { id } = req.query;
  console.log(id);
  if (id == "id") {
    return res.json({ flag: true });
  }
  res.json({ flag: false });
});

router.get("/hit", (req, res) => {
  res.json({
    message: "steghide extract -sf <stego_image> -xf <extracted_data>",
  });
});

router.get("/leaderboard", async (req, res) => {
  const users = await User.find({}).sort({ score: -1 });
  return res.json(users);
});

router.post("/update", async (req, res) => {
  const { id, score } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: id },
    { $inc: { score: score } },
    { new: true }
  );
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json({ message: "Score updated", user });
});

router.post("/sqlInjection", (req, res) => {
  const { username, password } = req.body;
  if (username === `admin'or'1'='1` && password === `admin'or'1'='1`) {
    return res.json({ message: "Welcome admin", flag: true });
  }
  return res.json({ message: "Invalid credentials", flag: false });
});
// one link for image src link
// radnom variable in variable
// console.log('')
// we need a place js 
// xss and sql 
// xss 
// store usrename and pswd in a table
// select * from tablename where username = 'admin' and password = 'admin'or'1'='1'
// return boolean (null / not)
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
router.get("/images", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/" + req.user.src + ".jpg"));
});

router.get("/allVaults", async (req, res) => {
  const users = await User.find({}, { username: 1 });
  res.json(users);
});

router.post("/chechVault", async (req, res) => {
  const { passwordEntered, userId } = req.body;
  const user = await User.findById(userId);
  if (passwordEntered === user.vaultPassword) {
    return res.json({ message: "Vault opened", flag: true, pic: user.pic });
  } else {
    return res.json({ message: "Invalid password", flag: false });
  }
});

router.get("/addVault", async (req, res) => {
  const currUserId = req.user._id;
  const other = req.body.userId;
  const user = await User.findById(currUserId);
  const otherUser = await User.findById(other);
  user.pic.push(...otherUser.pic);
  await user.save();
  res.json({ message: "Images added" });
});

router.get("/deleteVault", async (req, res) => {
  const other = req.body.userId;
  const otherUser = await User.findById(other);
  otherUser.pic = [];
  await otherUser.save();
  res.json({ message: "Images deleted" });
});

export { router as Game };
