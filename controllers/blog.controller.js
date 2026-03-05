const pool = require("../config/database");
const redis = require("../config/redis");

// ------------------ GET ALL BLOGS ------------------
const allBlogs = async (req, res) => {
  try {

    // Check if blogs are cached in Redis
    const cachedBlogs = await redis.get("all_blogs");
    if (cachedBlogs) {
      return res
        .status(200)
        .json({ blogs: JSON.parse(cachedBlogs), source: "cache" });
    }

    // If not cached, fetch from database
    const result = await pool.query(
      "SELECT * FROM blogs ORDER BY created_at DESC"
    );

    // Cache the result in Redis for 1 hour (3600 seconds)
    await redis.set("all_blogs", JSON.stringify(result.rows), "EX", 3600);

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

    // Check if blog is cached in Redis
    const cachedBlog = await redis.get(`blog_${id}`);
    if (cachedBlog) {
      return res.status(200).json({ blog: JSON.parse(cachedBlog), source: "cache" });
    }

    // If not cached, fetch from database
    const result = await pool.query(
      "SELECT * FROM blogs WHERE id = $1",
      [id]
    );

    // If blog not found, return 404
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Cache the result in Redis for 1 hour (3600 seconds)
    await redis.set(`blog_${id}`, JSON.stringify(result.rows[0]), "EX", 3600);

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

    // Check if blog exists
    let checkBlog;
    const cashedBlogs = await redis.get("all_blogs");

    // Check if blog exists in cache first, if not check in database
    if (cashedBlogs) {
      const blogs = JSON.parse(cashedBlogs);
      checkBlog = blogs.find((blog) => blog.id === parseInt(id)).id;
    } else {
      const result = await pool.query(
        "SELECT id FROM blogs WHERE id = $1",
        [id]
      );
      checkBlog = result.rows[0].id;
    }
    if (checkBlog.id) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Increment view count in database
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