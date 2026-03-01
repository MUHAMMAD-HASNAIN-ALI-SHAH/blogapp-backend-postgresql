const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const protectedRoute = require("../middlewares/protectedRoute.middleware");

router.get("/liked-blogs", protectedRoute, profileController.getLikedBlogs);

module.exports = router;
