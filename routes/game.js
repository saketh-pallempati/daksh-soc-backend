import express from "express";
import { User } from "../models/User.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// function getInput() {
//   prompt.start();
//   return new Promise((resolve, reject) => {
//     prompt.get(["number"], function (err, result) {
//       if (err) {
//         reject(err);
//       }
//       const num = parseInt(result.number);
//       if (num === 1 || num === 0) {
//         console.log(`You entered ${num}`);
//         resolve(num);
//       } else {
//         console.log("Invalid input. Please enter 1 or 0.");
//         resolve(getInput());
//       }
//     });
//   });
// }

router.post("/message", (req, res) => {
  const { message } = req.body;
  console.log(`Message by: ${req.user.username}=> ${message}`);
  console.log();
  res.json({ message: "Message received" });
});

// const ans = [1, 2, 3, 4, 5];
// const hints = [1, 2, 3, 4, 5];
// router.post("/check", async (req, res) => {
//   const { comment } = req.body;
//   if (ans.indexOf(comment) !== -1) {
//     return res.json({
//       flag: true,
//       hint: hints[ans.indexOf(comment)],
//     });
//   } else {
//     return res.json({ flag: false });
//   }
// });

router.get("/hit", (req, res) => {
  res.json({
    message: "steghide extract -sf <stego_image> -xf <extracted_data>",
  });
});

router.post("/sqlInjection", (req, res) => {
  const { username, password } = req.body;
  if (username === `admin'or'1'='1` && password === `admin'or'1'='1`) {
    return res.json({ message: "Welcome admin", flag: true });
  }
  return res.json({ message: "Invalid credentials", flag: false });
});

router.get("/images", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/" + req.user.src + ".jpg"));
});

router.get("/allVaults", async (req, res) => {
  const users = await User.find({}, { username: 1, _id: 1 });
  res.json(users);
});

router.post("/checkVault", async (req, res) => {
  const { userId, passwordEntered } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (passwordEntered === user.vaultPassword) {
      return res.json({ message: "Vault opened", flag: true, pic: user.pic });
    } else {
      return res.json({ message: "Invalid password", flag: false });
    }
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", error: err });
  }
});

router.post("/addVault", async (req, res) => {
  const currUserId = req.user._id;
  const other = req.body.userId;
  const user = await User.findById(currUserId);
  const otherUser = await User.findById(other);
  await User.updateOne(
    { _id: user._id },
    { $addToSet: { pic: { $each: otherUser.pic } } }
  );
  res.json({ message: "Images added" });
});

router.delete("/deleteVault", async (req, res) => {
  const other = req.body.userId;
  const otherUser = await User.findById(other);
  otherUser.pic = [];
  await otherUser.save();
  res.json({ message: "Images deleted" });
});

export { router as Game };
