import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

import { connectDB, closeDB } from "./lib/db.js";

import logger from "./utils/logger.js";
import { ApiError } from "./utils/ApiError.js";
import { initializeSocket } from "./socket.js";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Ensure upload directories exist at startup
const uploadDirs = [
  path.join(__dirname, "uploads"),
  path.join(__dirname, "uploads", "audio"),
  path.join(__dirname, "uploads", "channelsChat"),
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Express app instance
const app = express();

// ============ CRITICAL: CORS MUST BE FIRST ============
const allowedOrigins = [
  // "https://lbdentalacademy.com",
  // "https://lbdentalacademy.com:80",
  // "https://lbdentalacademy.com:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  // lbbenyahia – add both https + www variants
  "https://lbbenyahia.com",
  // "https://www.lbbenyahia.com",
  
  "http://localhost:80",
  "http://165.227.148.145",
  "http://165.227.148.145:80",
  "capacitor://localhost",
  // "capacitor://lbdentalacademy.com",
  "ionic://localhost",
  // "ionic://lbdentalacademy.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "Access-Control-Allow-Origin"
  ],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  exposedHeaders: ["Content-Length", "Content-Type"]
}));

app.options("*", cors()); // Handle preflight requests

// ============ INCREASE BODY PARSER LIMITS ============
// THIS MUST COME AFTER CORS BUT BEFORE ROUTES
app.use(express.json({ 
  limit: '50mb',
  extended: true 
}));

app.use(express.urlencoded({ 
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));

// Static file serving
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".m4a")) {
        res.setHeader("Content-Type", "audio/mp4");
      } else if (filePath.endsWith(".webm")) {
        res.setHeader("Content-Type", "audio/webm");
      } else if (filePath.endsWith(".wav")) {
        res.setHeader("Content-Type", "audio/wav");
      }
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    },
  })
);

app.use("/course", express.static(path.join(__dirname, "course")));

// ROUTES
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/test", testRoute);
app.use("/api/v1/chats", chatRoute);
app.use("/api/v1/messages", messageRoute);

// Wrong API Route handler
app.use((req, res, next) => {
  const error = new ApiError("API route not found", 404);
  next(error);
});

// ============ ENHANCED ERROR HANDLER WITH CORS ============
app.use((err, req, res, next) => {
  // Ensure CORS headers are present even on errors
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Origin');

  // Handle PayloadTooLarge specifically
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({
      status: 'error',
      code: 413,
      message: 'Request payload too large. Please reduce the amount of data being sent.',
      details: 'Maximum allowed size is 50MB'
    });
  }

  // Handle ApiError instances
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      code: err.statusCode,
      status: err.status,
      message: err.message,
    });
  }

  // Log and handle generic errors
  logger.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

(async () => {
  try {
    await connectDB();

    server.listen(PORT, "0.0.0.0", () => {
      logger.info(`Server is running on ${process.env.SERVER_URL}:${PORT}`);
      logger.info(`✅ Body parser limit set to 50MB`);
    });

    // Initialize Socket.IO with the HTTP server
    initializeSocket(server);

    server.keepAliveTimeout = 3000;

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Promise Rejection:', reason);
    });

    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
    });

    process.on("SIGTERM", () => {
      logger.info("SIGTERM signal received: closing HTTP server");
      server.close(async () => {
        logger.info("HTTP server closed");
        await closeDB();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Failed to start server");
    logger.error(error.stack);
    process.exit(1);
  }
})();