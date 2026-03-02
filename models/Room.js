import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomId: String,
  name: String
});

export default mongoose.model("Room", roomSchema);