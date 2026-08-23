const Blog = require("../models/blog.model");
const Like = require("../models/like.model");

// ------------------ TOGGLE LIKE ------------------
const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const existingLike = await Like.findOne({
      blogId,
      userId,
    });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);

      return res.status(200).json({
        isLiked: false,
      });
    }

    await Like.create({
      blogId,
      userId,
    });

    return res.status(201).json({
      isLiked: true,
    });
  } catch (error) {
    console.error("Error toggling like:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ------------------ GET BLOG LIKES COUNT ------------------
const getBlogLikes = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const likeCount = await Like.countDocuments({
      blogId,
    });

    return res.status(200).json({
      likeCount,
    });
  } catch (error) {
    console.error("Error fetching blog likes:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ------------------ CHECK LIKE STATUS ------------------
const checkLikeStatus = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const like = await Like.findOne({
      blogId,
      userId,
    });

    return res.status(200).json({
      liked: !!like,
    });
  } catch (error) {
    console.error("Error checking like status:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  toggleLike,
  getBlogLikes,
  checkLikeStatus,
};