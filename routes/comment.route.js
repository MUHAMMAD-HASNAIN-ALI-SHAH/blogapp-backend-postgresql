const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const protectedRoute = require("../middlewares/protectedRoute.middleware");

router.post("/:blogId", protectedRoute, commentController.addComment);
router.get("/:blogId", commentController.getBlogComments);
router.delete("/:blogId/:commentId", protectedRoute, commentController.deleteComment);

module.exports = router;
