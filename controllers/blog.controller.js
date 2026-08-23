const Blog = require("../models/blog.model");

// ------------------ GET ALL BLOGS ------------------
const allBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({ blogs });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

// ------------------ GET BLOG BY ID ------------------
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.status(200).json({ blog });
  } catch (err) {
    console.error("Error fetching blog:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

// ------------------ ADD VIEW ------------------
const addView = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    blog.views += 1;
    await blog.save();

    return res.status(200).json({
      message: "View count updated successfully",
    });
  } catch (err) {
    console.error("Error updating view count:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  allBlogs,
  getBlogById,
  addView,
};