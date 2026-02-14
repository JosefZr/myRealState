import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
