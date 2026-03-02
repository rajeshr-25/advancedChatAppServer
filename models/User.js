import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: String,
  username: String,
  email: String,
  passwordHash: String,
  lastSeen: Date
});

export default mongoose.model("User", userSchema);