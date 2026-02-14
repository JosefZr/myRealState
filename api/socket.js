import { Server } from "socket.io";
// import {
//   getMissedMessages,
// } from "./services/privateMessages.services.js";
import logger from "./utils/logger.js";
import { authenticateSocket } from "./middlewares/socket.auth.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin:  ["http://localhost:5173","http://localhost:80","http://165.227.148.145","http://165.227.148.145:80","https://lbdentalacademy.com","https://lbdentalacademy.com:80","https://lbdentalacademy.com:3000"],
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
	allowEIO3:true,
  });

  io.on('connect_error', (error) => {
     console.error('Socket.IO server error:', error);
  });
  // Apply authentication middleware
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    // socket.on("joinRoom", async ({ recipientId }) => {
    //   try {
    //     const roomId = [socket.user.userId, recipientId].sort().join("_");
    //     socket.join(roomId);

    //     logger.info("joined");
    //     logger.info(socket.id);

    //     const missedMessages = await getMissedMessages(socket.user.userId);
    //     const updatePromises = missedMessages.map(async (message) => {
    //       message.status = "read";
    //       return message.save();
    //     });
    //     await Promise.all(updatePromises);
    //   } catch (error) {
    //     logger.error(`Error joining room: ${error.message}`);
    //     socket.emit("error", { message: "Failed to join room." });
    //   }
    // });
    socket.on("logout", () => {
      socket.leaveAll(); 
      socket.disconnect(true); 
    });
    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.user.userId}`);
    });
  });
};
