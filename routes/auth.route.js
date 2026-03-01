const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const protectedRoute = require("../middlewares/protectedRoute.middleware");
const authValidators = require("../validators/auth.validators");

router.post("/register", authValidators.registerValidator, authController.register);
router.post("/login", authValidators.loginValidator, authController.login);
router.get("/verify", protectedRoute, authController.verify);
router.get("/logout", authController.logout);

module.exports = router;
