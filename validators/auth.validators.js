const registerValidator = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // ---------- Username ----------
    if (!username) {
      return res.status(400).json({ message: "Please fill in username" });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({
        message: "Username must be between 3 and 20 characters",
      });
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message: "Username can only contain letters, numbers, and underscore",
      });
    }

    // ---------- Email ----------
    if (!email) {
      return res.status(400).json({ message: "Please fill in email" });
    }

    if (email.length > 40) {
      return res.status(400).json({
        message: "Email must be less than 40 characters",
      });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // ---------- Password ----------
    if (!password) {
      return res.status(400).json({ message: "Please fill in password" });
    }

    if (password.length < 8 || password.length > 20) {
      return res.status(400).json({
        message: "Password must be between 8 and 20 characters",
      });
    }

    next();
  } catch (error) {
    console.error("Register Validator Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginValidator = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please fill in email" });
    }

    if (!password) {
      return res.status(400).json({ message: "Please fill in password" });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    next();
  } catch (error) {
    console.error("Login Validator Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { registerValidator, loginValidator };
