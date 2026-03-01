const express = require("express");
const router = express.Router();
const likeController = require("../controllers/like.controller");
const protectedRoute = require("../middlewares/protectedRoute.middleware");

router.post("/:blogId", protectedRoute, likeController.toggleLike);
router.get("/:blogId", likeController.getBlogLikes);
router.get("/:blogId/status", protectedRoute, likeController.checkLikeStatus);

module.exports = router;
