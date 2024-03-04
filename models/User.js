import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  score: { type: Number, default: 0 },
  vaultPassword: { type: String },
  src: { type: String, default: null },
  pic: {
    type: [String],
    default: ["https://www.w3schools.com/images/w3schools_green.jpg"],
  },
});

const UserModel = mongoose.model("User", UserSchema);

export { UserModel as User };
