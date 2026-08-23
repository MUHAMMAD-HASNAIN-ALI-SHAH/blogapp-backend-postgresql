const Like = require("../models/like.model");

const getLikedBlogs = async (req, res) => {
  try {
    const userId = req.user._id;

    const likes = await Like.find({
      userId,
    })
      .populate(
        "blogId",
        "title description image createdAt"
      )
      .sort({ createdAt: -1 });

    const likedBlogs = likes
      .filter((like) => like.blogId)
      .map((like) => ({
        id: like.blogId._id,
        title: like.blogId.title,
        description: like.blogId.description,
        image: like.blogId.image,
        createdAt: like.blogId.createdAt,
      }));

    return res.status(200).json({
      likedBlogs,
    });
  } catch (error) {
    console.error("Error fetching liked blogs:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getLikedBlogs,
};