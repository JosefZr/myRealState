import express from "express";
import { authenticateToken } from "../middlewares/auth.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  savePost,
  profilePosts,
  getNotificationNumber,
  getUserStats,
  checkPostSaved,
} from "../controllers/user.controller.js";

const router = express.Router();

// Public routes
router.get("/search/:id", getUser); // Get user by ID (public profile)

// Protected routes (require authentication)
router.get("/", authenticateToken, getUsers); // Get all users (admin feature)
router.get("/stats", authenticateToken, getUserStats); // Get user statistics
router.post("/profilePosts", authenticateToken, profilePosts); // Get user's posts and saved posts
router.get("/notification", authenticateToken, getNotificationNumber); // Get notification count
router.get("/saved/:postId", authenticateToken, checkPostSaved); // Check if post is saved

router.put("/:id", authenticateToken, updateUser); // Update user profile
router.delete("/:id", authenticateToken, deleteUser); // Delete user account

router.post("/save", authenticateToken, savePost); // Save/unsave a post

export default router;