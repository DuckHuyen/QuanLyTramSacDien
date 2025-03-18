//app.js

const express = require("express");
const path = require("path");
const session = require("express-session"); // Import express-session
const accountRoutes = require("./routes/accountRoutes.js");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const stationController = require("./controllers/stationController");
const flash = require("connect-flash");

const app = express();
const PORT = process.env.PORT || 3003;

// Cấu hình View Engine và thư mục tĩnh
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
// Cấu hình Session
app.use(
  session({
    secret: "mySecretKey123",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true nếu sử dụng HTTPS
  })
);
app.use((req, res, next) => {
  res.locals.messages = req.flash(); // Truyền messages vào res.locals
  next();
});

const checkLogin = (req, res, next) => {
  if (req.session.user) {
    res.redirect("/user");
  } else {
    next();
  }
};

// Trang chủ hiển thị danh sách trạm sạc
app.get("/", checkLogin, stationController.getAllStations);

// Route cho tài khoản
app.use("/account", accountRoutes);

// Route cho quản trị viên
app.use("/admin", adminRoutes);

//
app.use("/user", userRoutes);

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
