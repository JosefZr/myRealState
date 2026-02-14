// export const getPosts = async (req, res) => {
//   const query = req.query;

//   try {
//     const posts = await prisma.post.findMany({
//       where: {
//         city: query.city || undefined,
//         type: query.type || undefined,
//         property: query.property || undefined,
//         bedroom: parseInt(query.bedroom) || undefined,
//         price: {
//           gte: parseInt(query.minPrice) || undefined,
//           lte: parseInt(query.maxPrice) || undefined,
//         },
//       },
//     });

//     // setTimeout(() => {
//     res.status(200).json(posts);
//     // }, 3000);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get posts" });
//   }
// };

// export const getPost = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const post = await prisma.post.findUnique({
//       where: { id },
//       include: {
//         postDetail: true,
//         user: {
//           select: {
//             username: true,
//             avatar: true,
//           },
//         },
//       },
//     });

//     const token = req.cookies?.token;

//     if (token) {
//       jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
//         if (!err) {
//           const saved = await prisma.savedPost.findUnique({
//             where: {
//               userId_postId: {
//                 postId: id,
//                 userId: payload.id,
//               },
//             },
//           });
//           res.status(200).json({ ...post, isSaved: saved ? true : false });
//         }
//       });
//     }
//     res.status(200).json({ ...post, isSaved: false });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get post" });
//   }
// };

// export const addPost = async (req, res) => {
//   const body = req.body;
//   const tokenUserId = req.userId; // ID of the authenticated user

//   try {
//     const newPost = await prisma.post.create({
//       data: {
//         ...body.postData, // title, price, images, address, city, etc.
//         user: {
//           connect: { id: tokenUserId }, // connect the post to the user
//         },
//         postDetail: {
//           create: body.postDetail, // create the postDetail if provided
//         },
//       },
//     });

//     res.status(200).json(newPost);
//   } catch (err) {
//     console.log(err);
//     res
//       .status(500)
//       .json({ message: "Failed to create post", error: err.message });
//   }
// };

// export const updatePost = async (req, res) => {
//   try {
//     res.status(200).json();
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to update posts" });
//   }
// };

// export const deletePost = async (req, res) => {
//   const id = req.params.id;
//   const tokenUserId = req.userId;

//   try {
//     const post = await prisma.post.findUnique({
//       where: { id },
//     });

//     if (post.userId !== tokenUserId) {
//       return res.status(403).json({ message: "Not Authorized!" });
//     }

//     await prisma.post.delete({
//       where: { id },
//     });

//     res.status(200).json({ message: "Post deleted" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to delete post" });
//   }
// };

import Post from "../models/Post.js";
import User from "../models/User.js";

// Get all posts with filtering
export const getPosts = async (req, res) => {
  try {
    const {
      city,
      type,
      property,
      bedroom,
      bathroom,
      minPrice,
      maxPrice,
      rentalPeriod,
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    const query = {};

    if (city) query.city = new RegExp(city, "i"); // Case-insensitive search
    if (type) query.type = type;
    if (property) query.property = property;
    if (bedroom) query.bedroom = parseInt(bedroom);
    if (bathroom) query.bathroom = parseInt(bathroom);
    if (rentalPeriod) query.rentalPeriod = rentalPeriod;

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const posts = await Post.find(query)
      .populate("user", "firstName lastName avatar email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch posts",
      message: error.message,
    });
  }
};

// Get single post
export const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate("user", "firstName lastName avatar email phoneNumber")
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch post",
      message: error.message,
    });
  }
};

// Add new post
export const addPost = async (req, res) => {
  try {
    const { postData } = req.body;
    const userId = req.user._id; // From verifyToken middleware

    // Validate required fields
    if (!postData) {
      return res.status(400).json({
        success: false,
        error: "Post data is required",
      });
    }

    // For rent type, validate rental fields
    if (postData.type === "rent") {
      if (!postData.rentalPeriod) {
        return res.status(400).json({
          success: false,
          error: "Rental period is required for rent type",
        });
      }
      if (!postData.rentalDuration || postData.rentalDuration < 1) {
        return res.status(400).json({
          success: false,
          error: "Rental duration must be at least 1",
        });
      }
    }

    // Merge postData and postDetail
    const completePostData = {
      ...postData,
      user: userId,
    };

    // Create post
    const post = await Post.create(completePostData);

    // Populate user data before sending response
    await post.populate("user", "firstName lastName avatar email");

    res.status(201).json({
      success: true,
      data: post,
      message: "Post created successfully",
    });
  } catch (error) {
    console.error("Add post error:", error);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors,
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to create post",
      message: error.message,
    });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { postData } = req.body;
    const userId = req.user._id;

    // Find post
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    // Check if user is the owner
    if (!post.isOwner(userId)) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to update this post",
      });
    }

    // Validate rental fields if type is changing to rent or already rent
    const updatedType = postData?.type || post.type;
    if (updatedType === "rent") {
      const rentalPeriod = postData?.rentalPeriod || post.rentalPeriod;
      const rentalDuration = postData?.rentalDuration || post.rentalDuration;

      if (!rentalPeriod) {
        return res.status(400).json({
          success: false,
          error: "Rental period is required for rent type",
        });
      }
      if (!rentalDuration || rentalDuration < 1) {
        return res.status(400).json({
          success: false,
          error: "Rental duration must be at least 1",
        });
      }
    }

    // Build update data with proper field mapping
    const updateData = {};
    
    // Update main post data
    if (postData?.title !== undefined) updateData.title = postData.title;
    if (postData?.price !== undefined) updateData.price = postData.price;
    if (postData?.address !== undefined) updateData.address = postData.address;
    if (postData?.city !== undefined) updateData.city = postData.city;
    if (postData?.bedroom !== undefined) updateData.bedroom = postData.bedroom;
    if (postData?.bathroom !== undefined) updateData.bathroom = postData.bathroom;
    if (postData?.type !== undefined) updateData.type = postData.type;
    if (postData?.property !== undefined) updateData.property = postData.property;
    if (postData?.latitude !== undefined) updateData.latitude = postData.latitude;
    if (postData?.longitude !== undefined) updateData.longitude = postData.longitude;
    if (postData?.images !== undefined) updateData.images = postData.images;
    
    // Update additional details (map desc to description)
    if (postData?.description !== undefined) updateData.description = postData.description;
    if (postData?.utilities !== undefined) updateData.utilities = postData.utilities;
    if (postData?.pet !== undefined) updateData.pet = postData.pet;
    if (postData?.income !== undefined) updateData.income = postData.income;
    if (postData?.size !== undefined) updateData.size = postData.size;
    if (postData?.school !== undefined) updateData.school = postData.school;
    if (postData?.bus !== undefined) updateData.bus = postData.bus;
    if (postData?.restaurant !== undefined) updateData.restaurant = postData.restaurant;

    // Handle rental fields
    if (updatedType === "rent") {
      if (postData?.rentalPeriod !== undefined) updateData.rentalPeriod = postData.rentalPeriod;
      if (postData?.rentalDuration !== undefined) updateData.rentalDuration = postData.rentalDuration;
    } else if (updatedType === "sale" && post.type === "rent") {
      // Remove rental fields if changing from rent to sale
      updateData.rentalPeriod = undefined;
      updateData.rentalDuration = undefined;
    }

    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("user", "firstName lastName avatar email");

    res.status(200).json({
      success: true,
      data: updatedPost,
      message: "Post updated successfully",
    });
  } catch (error) {
    console.error("Update post error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors,
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to update post",
      message: error.message,
    });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find post
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    // Check if user is the owner
    if (!post.isOwner(userId)) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to delete this post",
      });
    }

    // Delete post
    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete post",
      message: error.message,
    });
  }
};

// Get user's posts
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: posts,
      count: posts.length,
    });
  } catch (error) {
    console.error("Get user posts error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user posts",
      message: error.message,
    });
  }
};