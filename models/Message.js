import mongoose from "mongoose";

const msgSchema = new mongoose.Schema({
  messageId: String,
  roomId: String,
  userId: String,
  username: String,
  text: String,
  createdAt: Date
});

export default mongoose.model("Message", msgSchema);