// import mongoose from "mongoose";
// import Message from "../models/Message.js";
// import { deleteMessageImages } from "../utils/fileUtils.js";

// export const saveMessage = async (
//   sender,
//   recipient,
//   content,
//   images,
//   contentStatus,
//   replyTo = null
// ) => {
//   console.log("pppp2", sender,
//     recipient,
//     content,
//     images,
//     contentStatus)

//   const message = new Message({
//     sender,
//     recipient,
//     content,
//     images,
//     status: contentStatus,
//     replyTo
//   });
//   await message.save();
//   console.log("pppp3")

//   const populatedMessage = await Message.findById(message._id)
//     .populate("sender")
//     .populate("recipient")
//      .populate({
//     path: "replyTo",
//     populate: { path: "sender", select: "firstName lastName" }  // ✅ Populate sender of replied message
//   });
//     console.log("pppp4")

//   return populatedMessage;
// };
// export const deletePrivateMessage = async (content, createdAt, senderId) => {
//   try {
//     const message = await Message.findOne({ content, createdAt, sender: senderId });
//     if (!message) {
//       throw new Error("Message not found");
//     }
//     console.log(message);
//     // Delete associated images first
//     await deleteMessageImages(message.images);
//     // Delete the message itself
//     await message.deleteOne();

//     return message; // This object will have the _id, sender, and recipient fields
//   } catch (error) {
//     throw error;
//   }
// };

// export const getMessages = async (userId1, userId2, page = 1) => {
//   console.log(page);
//   const skip = (page - 1) * 30;

//   const messages = await Message.find({
//     $or: [
//       { sender: userId1, recipient: userId2 },
//       { sender: userId2, recipient: userId1 },
//     ],
//   })
//     .sort({ timestamp: -1 })
//     .populate("sender")
//     .populate("recipient")
//      .populate({
//         path: "replyTo",
//         populate: { path: "sender", select: "firstName lastName content" } // ✅ include content + sender name
//       })
//     .skip(skip)
//     .limit(30);

//   return messages.reverse();
// };

// export const getMissedMessages = async (userId) => {
//   return await Message.find({ recipient: userId, status: "sent" });
// };

// // Get all chats
// export const getChats = async (userId) => {
//   const chats = await Message.aggregate([
//     {
//       $match: {
//         $or: [{ sender: userId }, { recipient: userId }],
//       },
//     },
//     {
//       $group: {
//         _id: {
//           $cond: [{ $eq: ["$sender", userId] }, "$recipient", "$sender"],
//         },
//         lastMessage: { $last: "$$ROOT" }, // Get the last message directly
//       },
//     },
//     {
//   $lookup: {
//     from: "messages",
//     localField: "lastMessage.replyTo",
//     foreignField: "_id",
//     as: "replyMessage"
//   }
// },
// {
//   $unwind: {
//     path: "$replyMessage",
//     preserveNullAndEmptyArrays: true
//   }
// },
//     {
//       $lookup: {
//         from: "users",
//         localField: "_id",
//         foreignField: "_id",
//         as: "recipientInfo",
//       },
//     },
//     {
//       $unwind: "$recipientInfo", // Unwind the array to get individual objects
//     },
//     {
//       $addFields: {
//         recipient: "$recipientInfo",
//       },
//     },
//     {
//       $replaceRoot: {
//         newRoot: {
//           recipient: "$recipient",
//           lastMessage: "$lastMessage", // Include last message
//         },
//       },
//     },
//   ]);

//   return chats;
// };
