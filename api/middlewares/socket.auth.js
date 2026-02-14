import jwt from "jsonwebtoken";

// Middleware to authenticate Socket.IO connections
export const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    const err = new Error("Authentication error");
    err.data = { message: "Token missing" };
    return next(err);
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.user = decoded; // Attach user data to socket instance
    next();
  } catch (error) {
    console.log("Auth problem : ", error);
    const err = new Error("Authentication error");
    err.data = { message: "Invalid token" };
    return next(err);
  }
};
