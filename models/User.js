import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  vaultPassword: { type: String },
  src: { type: String, default: null },
  pic: {
    type: [String],
    default: [],
  },
});

const UserModel = mongoose.model("User", UserSchema);

export { UserModel as User };
