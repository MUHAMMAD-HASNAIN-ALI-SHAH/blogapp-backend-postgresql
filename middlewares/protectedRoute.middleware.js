const pool = require("../config/database");
const jwt = require("jsonwebtoken");

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error("Error in protected route middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = protectedRoute;