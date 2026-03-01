const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");

router.get("/", blogController.allBlogs);
router.get("/:id", blogController.getBlogById);
router.put("/view/:id", blogController.addView);

module.exports = router;
