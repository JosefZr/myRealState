import express from "express";
import {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
  getUserPosts,
} from "../controllers/post.controller.js";
import { authenticateToken } from "../middlewares/auth.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posts"); // Ensure this directory exists and is writable
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG and PNG are allowed."));
    }
  },
});
// Public routes
router.get("/", getPosts);
router.get("/:id", getPost);

// Protected routes (require authentication)
router.post("/", authenticateToken, addPost);
router.put("/:id", authenticateToken, updatePost);
router.delete("/:id", authenticateToken, deletePost);
router.get("/user/my-posts", authenticateToken, getUserPosts);
router.post("/storeImages", upload.array("images", 5) , (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded." });
    }
    const imageUrls = req.files.map((file) => `${req.protocol}://${req.get("host")}/uploads/posts/${file.filename}`);
    res.json({ success: true, imageUrls });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ success: false, error: "Failed to upload images" });
  }
});

export default router;