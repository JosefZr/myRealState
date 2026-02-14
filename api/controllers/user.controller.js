import User from "../models/User.js";
import Post from "../models/Post.js";
import bcrypt from "bcrypt";

// Get all users (admin only, with pagination)
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isBanned } = req.query;

    // Build query
    const query = {};
    if (role) query.role = role;
    if (isBanned !== undefined) query.isBanned = isBanned === "true";

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const users = await User.find(query)
      .select("-password -refreshToken") // Exclude sensitive fields
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
      message: error.message,
    });
  }
};

// Get single user by ID
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-password -refreshToken")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user",
      message: error.message,
    });
  }
};

// Update user profile
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Check if user is updating their own profile or is admin
    if (id !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to update this profile",
      });
    }

    const {
      firstName,
      lastName,
      phoneNumber,
      avatar,
      region,
      password,
      role,
      isBanned,
    } = req.body;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Build update object
    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) {
      // Check if phone number is already taken by another user
      const existingUser = await User.findOne({
        phoneNumber,
        _id: { $ne: id },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Phone number already in use",
        });
      }
      updateData.phoneNumber = phoneNumber;
    }
    if (avatar) updateData.avatar = avatar;
    if (region) updateData.region = region;

    // Only admins can change role and ban status
    if (req.user.role === "admin") {
      if (role) updateData.role = role;
      if (isBanned !== undefined) updateData.isBanned = isBanned;
    }

    // Handle password update
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: "Password must be at least 6 characters long",
        });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update user error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors,
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to update profile",
      message: error.message,
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Check if user is deleting their own account or is admin
    if (id !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to delete this account",
      });
    }

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Delete all user's posts
    await Post.deleteMany({ user: id });

    // Delete user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete account",
      message: error.message,
    });
  }
};

// Save/unsave a post
export const savePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id;

    if (!postId) {
      return res.status(400).json({
        success: false,
        error: "Post ID is required",
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    post.isSaved = !post.isSaved; // Toggle saved status
    post.save();
    res.status(200).json({
      success: true,
      message: post.isSaved ? "Post saved successfully" : "Post unsaved successfully",
      data: post,
    });
  } catch (error) {
    console.error("Save post error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save/unsave post",
      message: error.message,
    });
  }
};

// Get user's profile posts (created posts and saved posts)
export const profilePosts = async (req, res) => {
  try {
    console.log("Profile posts request received"); // Debug log
    const userId = req.body.userId 
    console.log("Authenticated user ID:", userId); // Debug log

    console.log("Fetching posts for user:", userId); // Debug log

    // Get user's created posts
    const userPosts = await Post.find({ user: userId , isSaved: false })
      .populate("user", "firstName lastName avatar email")
      .sort({ createdAt: -1 })
      .lean();

    // Get user's saved posts
    const savedPosts = await Post.find({ isSaved:true })
      .populate("user", "firstName lastName avatar email")
      .sort({ createdAt: -1 })
      .lean();

    console.log("Found userPosts:", userPosts.length); // Debug log
    console.log("Found savedPosts:", savedPosts.length); // Debug log

    res.status(200).json({
      success: true,
      data: {
        userPosts,
        savedPosts,
      },
      counts: {
        userPosts: userPosts.length,
        savedPosts: savedPosts.length,
      },
    });
  } catch (error) {
    console.error("Profile posts error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch profile posts",
      message: error.message,
    });
  }
};

// Get notification count (for future implementation)
export const getNotificationNumber = async (req, res) => {
  try {
    const userId = req.user._id;

    // This is a placeholder for future notification implementation
    // You can expand this based on your notification system requirements

    // Example: Count unread messages, new activity on user's posts, etc.
    // For now, returning 0
    const notificationCount = 0;

    res.status(200).json({
      success: true,
      data: {
        count: notificationCount,
      },
    });
  } catch (error) {
    console.error("Get notification number error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch notifications",
      message: error.message,
    });
  }
};

// Get user statistics (for profile page)
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Count user's posts
    const postsCount = await Post.countDocuments({ user: userId });

    // Count saved posts
    const savedPostsCount = await Post.countDocuments({ savedBy: userId });

    // Get user data
    const user = await User.findById(userId).select(
      "-password -refreshToken"
    );

    res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          totalPosts: postsCount,
          savedPosts: savedPostsCount,
          memberSince: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user statistics",
      message: error.message,
    });
  }
};

// Check if user has saved a post
export const checkPostSaved = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId).select("savedBy").lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    const isSaved = post.savedBy.some(
      (id) => id.toString() === userId.toString()
    );

    res.status(200).json({
      success: true,
      data: {
        isSaved,
      },
    });
  } catch (error) {
    console.error("Check post saved error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check post status",
      message: error.message,
    });
  }
};