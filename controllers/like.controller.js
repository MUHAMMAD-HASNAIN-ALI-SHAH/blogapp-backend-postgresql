const pool = require("../config/database");

// ------------------ TOGGLE LIKE ------------------
const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;

    // Check blog exists
    const blogResult = await pool.query(
      "SELECT id FROM blogs WHERE id = $1",
      [blogId]
    );

    if (blogResult.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if already liked
    const likeResult = await pool.query(
      "SELECT * FROM likes WHERE blog_id = $1 AND user_id = $2",
      [blogId, userId]
    );

    if (likeResult.rows.length > 0) {
      await pool.query(
        "DELETE FROM likes WHERE blog_id = $1 AND user_id = $2",
        [blogId, userId]
      );

      return res.status(200).json({ isLiked: false });
    }

    // Add like
    await pool.query(
      "INSERT INTO likes (blog_id, user_id) VALUES ($1, $2)",
      [blogId, userId]
    );

    return res.status(201).json({ isLiked: true });
  } catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------ GET BLOG LIKES COUNT ------------------
const getBlogLikes = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Check blog exists
    const blogResult = await pool.query(
      "SELECT id FROM blogs WHERE id = $1",
      [blogId]
    );

    if (blogResult.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const likesResult = await pool.query(
      "SELECT COUNT(*) AS likeCount FROM likes WHERE blog_id = $1",
      [blogId]
    );

    return res.status(200).json({
      likeCount: Number(likesResult.rows[0].likecount),
    });
  } catch (error) {
    console.error("Error fetching blog likes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------ CHECK LIKE STATUS ------------------
const checkLikeStatus = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;

    // Check blog exists
    const blogResult = await pool.query(
      "SELECT id FROM blogs WHERE id = $1",
      [blogId]
    );

    if (blogResult.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const likeResult = await pool.query(
      "SELECT * FROM likes WHERE blog_id = $1 AND user_id = $2",
      [blogId, userId]
    );

    return res.status(200).json({
      liked: likeResult.rows.length > 0,
    });
  } catch (error) {
    console.error("Error checking like status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  toggleLike,
  getBlogLikes,
  checkLikeStatus,
};