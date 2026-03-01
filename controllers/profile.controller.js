const pool = require("../config/database");

const getLikedBlogs = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
         b.id,
         b.title,
         b.description,
         b.image,
         b.created_at AS "createdAt"
       FROM likes l
       JOIN blogs b ON l.blog_id = b.id
       WHERE l.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );

    return res.status(200).json({ likedBlogs: result.rows });
  } catch (error) {
    console.error("Error fetching liked blogs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getLikedBlogs };