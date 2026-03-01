const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const protectedRoute = require("../middlewares/protectedRoute.middleware");

router.post("/blog", protectedRoute, dashboardController.addBlog);
router.put("/blog/:id", protectedRoute, dashboardController.editBlog);
router.delete("/blog/:id", protectedRoute, dashboardController.deleteBlog);
router.get("/blog", protectedRoute, dashboardController.getMyBlogs);
router.get("/stats", protectedRoute, dashboardController.getStats);

module.exports = router;
