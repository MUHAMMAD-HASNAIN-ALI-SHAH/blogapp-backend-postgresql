const pool = require("../config/database");
const redis = require("../config/redis");

// ------------------ ADD COMMENT ------------------
const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    // Check if blog exists
    const cashedBlogs = await redis.get("all_blogs");
    let checkBlog;

    // Check if blog exists in cache first, if not check in database
    if (cashedBlogs) {
      const blogs = JSON.parse(cashedBlogs);
      checkBlog = blogs.find((blog) => blog.id === parseInt(blogId))?.id;
    } else {
      const result = await pool.query(
        "SELECT id FROM blogs WHERE id = $1",
        [blogId]
      );
      checkBlog = result.rows[0]?.id;
    }

    // Check if blog exists
    if (!checkBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Insert comment
    await pool.query(
      "INSERT INTO comments (user_id, blog_id, comment) VALUES ($1, $2, $3)",
      [userId, blogId, comment]
    );

    return res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------ GET BLOG COMMENTS ------------------
const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Check if blog exists
    const blogCheck = await pool.query(
      "SELECT id FROM blogs WHERE id = $1",
      [blogId]
    );
    if (blogCheck.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Get comments
    const result = await pool.query(
      `SELECT 
         c.id, 
         c.comment, 
         c.created_at AS "createdAt", 
         u.username, 
         u.id AS "userId"
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.blog_id = $1
       ORDER BY c.created_at DESC`,
      [blogId]
    );

    return res.status(200).json({ comments: result.rows });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ------------------ DELETE COMMENT ------------------
const deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const userId = req.user.id;

    // Check if blog exists
    const blogCheck = await pool.query(
      "SELECT id FROM blogs WHERE id = $1",
      [blogId]
    );
    if (blogCheck.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete comment
    const deleteResult = await pool.query(
      "DELETE FROM comments WHERE blog_id = $1 AND user_id = $2 AND id = $3 RETURNING id",
      [blogId, userId, commentId]
    );

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ message: "Comment not found or not authorized" });
    }

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addComment,
  getBlogComments,
  deleteComment,
};