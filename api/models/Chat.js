import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: String,
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
