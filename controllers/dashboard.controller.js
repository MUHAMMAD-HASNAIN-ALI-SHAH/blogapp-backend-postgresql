const Blog = require("../models/blog.model");
const Comment = require("../models/comment.model");
const Like = require("../models/like.model");
const cloudinary = require("../config/cloudinary");

// ------------------ ADD BLOG ------------------
const addBlog = async (req, res) => {
  try {
    const user = req.user;
    const { title, description, image, category } = req.body;

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "blogs_data",
    });

    await Blog.create({
      title,
      description,
      image: uploadResponse.secure_url,
      category,
      userId: user._id,
    });

    return res.status(201).json({
      message: "Blog added successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

// ------------------ EDIT BLOG ------------------
const editBlog = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { title, description, image, category } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    if (blog.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized",
      });
    }

    let imageUrl = blog.image;

    if (image && image !== blog.image) {
      const parts = blog.image.split("/");
      const fileName = parts[parts.length - 1];
      const imagePublicKey = fileName.split(".")[0];

      await cloudinary.uploader.destroy(
        `blogs_data/${imagePublicKey}`
      );

      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "blogs_data",
      });

      imageUrl = uploadResponse.secure_url;
    }

    blog.title = title;
    blog.description = description;
    blog.image = imageUrl;
    blog.category = category;

    await blog.save();

    return res.status(200).json({
      message: "Blog updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

// ------------------ DELETE BLOG ------------------
const deleteBlog = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    if (blog.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized",
      });
    }

    const parts = blog.image.split("/");
    const fileName = parts[parts.length - 1];
    const imagePublicKey = fileName.split(".")[0];

    await cloudinary.uploader.destroy(
      `blogs_data/${imagePublicKey}`
    );

    await Comment.deleteMany({ blogId: id });
    await Like.deleteMany({ blogId: id });

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

// ------------------ GET MY BLOGS ------------------
const getMyBlogs = async (req, res) => {
  try {
    const user = req.user;

    const blogs = await Blog.find({
      userId: user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      blogs,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

// ------------------ DASHBOARD STATS ------------------
const getStats = async (req, res) => {
  try {
    const user = req.user;

    const blogs = await Blog.find({
      userId: user._id,
    }).select("_id views");

    const blogIds = blogs.map((blog) => blog._id);

    const totalBlogs = blogs.length;

    const totalComments = await Comment.countDocuments({
      blogId: { $in: blogIds },
    });

    const totalLikes = await Like.countDocuments({
      blogId: { $in: blogIds },
    });

    const totalViews = blogs.reduce(
      (sum, blog) => sum + blog.views,
      0
    );

    return res.status(200).json({
      stats: {
        totalBlogs,
        totalComments,
        totalLikes,
        totalViews,
      },
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  addBlog,
  editBlog,
  deleteBlog,
  getMyBlogs,
  getStats,
};