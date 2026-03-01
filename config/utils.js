const jwt = require("jsonwebtoken");

const generateToken = (user, res) => {
  const token = jwt.sign({ userId: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "none",
  });
};

module.exports = { generateToken };
