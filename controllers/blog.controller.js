const pool = require("../config/database");

// ------------------ GET ALL BLOGS ------------------
const allBlogs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM blogs ORDER BY created_at DESC"
    );

    return res.status(200).json({ blogs: result.rows });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ------------------ GET BLOG BY ID ------------------
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    await new Promise(resolve => setTimeout(resolve, 2000));
    const result = await pool.query(
      "SELECT * FROM blogs WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ blog: result.rows[0] });
  } catch (err) {
    console.error("Error fetching blog by ID:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ------------------ ADD VIEW ------------------
const addView = async (req, res) => {
  try {
    const { id } = req.params;

    const checkBlog = await pool.query(
      "SELECT id FROM blogs WHERE id = $1",
      [id]
    );

    if (checkBlog.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await pool.query(
      "UPDATE blogs SET views = views + 1 WHERE id = $1",
      [id]
    );

    return res
      .status(200)
      .json({ message: "View count updated successfully" });
  } catch (err) {
    console.error("Error updating view count:", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  allBlogs,
  getBlogById,
  addView,
};