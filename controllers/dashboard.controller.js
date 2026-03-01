const pool = require("../config/database");
const cloudinary = require("../config/cloudinary");

// ------------------ ADD BLOG ------------------
const addBlog = async (req, res) => {
  try {
    const user = req.user;
    const { title, description, image, category } = req.body;

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "blogs_data",
    });

    const imageUrl = uploadResponse.secure_url;

    const result = await pool.query(
      `INSERT INTO blogs (title, description, image, category, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [title, description, imageUrl, category, user.id]
    );

    return res.status(201).json({
      message: "Blog added successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// ------------------ EDIT BLOG ------------------
const editBlog = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { title, description, image, category } = req.body;

    const blogResult = await pool.query(
      "SELECT * FROM blogs WHERE id = $1",
      [id]
    );

    if (blogResult.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const blog = blogResult.rows[0];

    if (blog.user_id !== user.id) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    let imageUrl = blog.image;

    // Upload new image only if changed
    if (image && image !== blog.image) {
      const parts = blog.image.split("/");
      const fileName = parts[parts.length - 1];
      const imagePublicKey = fileName.split(".")[0];

      await cloudinary.uploader.destroy(`blogs_data/${imagePublicKey}`);

      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "blogs_data",
      });

      imageUrl = uploadResponse.secure_url;
    }

    await pool.query(
      `UPDATE blogs
       SET title = $1,
           description = $2,
           image = $3,
           category = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5`,
      [title, description, imageUrl, category, id]
    );

    return res.status(200).json({ message: "Blog updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// ------------------ DELETE BLOG ------------------
const deleteBlog = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const blogResult = await pool.query(
      "SELECT * FROM blogs WHERE id = $1",
      [id]
    );

    if (blogResult.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const blog = blogResult.rows[0];

    if (blog.user_id !== user.id) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    // Delete image from Cloudinary
    const parts = blog.image.split("/");
    const fileName = parts[parts.length - 1];
    const imagePublicKey = fileName.split(".")[0];

    await cloudinary.uploader.destroy(`blogs_data/${imagePublicKey}`);

    await pool.query("DELETE FROM blogs WHERE id = $1", [id]);

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// ------------------ GET MY BLOGS ------------------
const getMyBlogs = async (req, res) => {
  try {
    const user = req.user;

    const result = await pool.query(
      "SELECT * FROM blogs WHERE user_id = $1 ORDER BY created_at DESC",
      [user.id]
    );

    return res.status(200).json({ blogs: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// ------------------ DASHBOARD STATS ------------------
const getStats = async (req, res) => {
  try {
    const user = req.user;

    const result = await pool.query(
      `SELECT 
        (SELECT COUNT(*) FROM blogs WHERE user_id = $1) AS totalBlogs,
        (SELECT COUNT(*) 
         FROM comments c 
         JOIN blogs b ON c.blog_id = b.id 
         WHERE b.user_id = $2) AS totalComments,
        (SELECT COUNT(*) 
         FROM likes l 
         JOIN blogs b ON l.blog_id = b.id 
         WHERE b.user_id = $3) AS totalLikes,
        (SELECT COALESCE(SUM(views), 0) 
         FROM blogs 
         WHERE user_id = $4) AS totalViews`,
      [user.id, user.id, user.id, user.id]
    );

    return res.status(200).json({ stats: result.rows[0] });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addBlog,
  editBlog,
  deleteBlog,
  getMyBlogs,
  getStats,
};