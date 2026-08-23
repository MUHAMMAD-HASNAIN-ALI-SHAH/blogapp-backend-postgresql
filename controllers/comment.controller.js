const Blog = require("../models/blog.model");
const Comment = require("../models/comment.model");

// ------------------ ADD COMMENT ------------------
const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    await Comment.create({
      userId,
      blogId,
      comment,
    });

    return res.status(201).json({
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ------------------ GET BLOG COMMENTS ------------------
const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const comments = await Comment.find({ blogId })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    const formattedComments = comments.map((comment) => ({
      id: comment._id,
      comment: comment.comment,
      createdAt: comment.createdAt,
      username: comment.userId.username,
      userId: comment.userId._id,
    }));

    return res.status(200).json({
      comments: formattedComments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ------------------ DELETE COMMENT ------------------
const deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      blogId,
      userId,
    });

    if (!deletedComment) {
      return res.status(404).json({
        message: "Comment not found or not authorized",
      });
    }

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  addComment,
  getBlogComments,
  deleteComment,
};