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

router.get("/check", async (req, res) => {
  const q = req.body.q;
  console.log(q);
  let x = await getInput();
  if (x === 1) {
    return res.json({ flag: true });
  }
  return res.json({ flag: false });
});

router.get("/query", (req, res) => {
  const id = req.query.id;
  if (id == "id") {
    return res.json({ flag: true });
  }
  res.json({ flag: false });
});

router.get("/hit", (req, res) => {
  res.json({ message: "Dos done" });
});

router.get("/leaderboard", async (req, res) => {
  const users = await User.find({}).sort({ score: -1 });
  return res.json(users);
});
// Lot to think of here is it authenticated route only one source of truth
router.post("/update", async (req, res) => {
  const { id, score } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: id },
    { score: score },
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
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
router.get("/images/:imageNum", (req, res) => {
  console.log(req.params.imageNum);
  res.sendFile(path.join(__dirname, "/public/" + req.params.imageNum + ".jpg"));
});
router.get('/chechVault', (req, res) =>{
  if(req.body.vaultPassword === user.vaultPassword){
    return res.json({message: "Vault opened"})
  }
})

export { router as Game };
