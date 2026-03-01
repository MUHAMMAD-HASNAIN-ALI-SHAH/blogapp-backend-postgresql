const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

// app.use((req, res, next) => {
//   setTimeout(() => next(), 5000);
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", require("./routes/auth.route"));
app.use("/api/v2/blogs", require("./routes/blog.route"));
app.use("/api/v3/comments", require("./routes/comment.route"));
app.use("/api/v4/likes", require("./routes/like.route"));
app.use("/api/v5/profile", require("./routes/profile.route"));
app.use("/api/v6/dashboard", require("./routes/dashboard.route"));

PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Blog server is running on the port ${PORT}`);
});
