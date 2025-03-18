//accountController.js

const accountModel = require("../models/account");

const accountControllers = {
  async register(req, res) {
    const { name, email, password } = req.body;
    try {
      const existingUser = await accountModel.getUserByEmail(email);
      if (existingUser) {
        return res.render("account", { message: "Email đã tồn tại!" });
      }
      await accountModel.createUser(name, email, password);
      res.render("account", { message: "Đăng ký thành công! Hãy đăng nhập." });
    } catch (error) {
      console.error("Chi tiết lỗi:", error.stack); // Log chi tiết hơn
      res.render("account", { message: "Lỗi server: " + error.message });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await accountModel.getUserByEmail(email);
      if (!user) {
        return res.render("account", { message: "Người dùng không tồn tại!" });
      }

      if (user.matkhau !== password) {
        return res.render("account", { message: "Sai mật khẩu!" });
      }
      req.session.user = user;
      // Chuyển hướng sau khi đăng nhập thành công
      if (user.loainguoidung === 2) {
        res.redirect("/admin"); // Trang admin nếu là quản trị viên
      } else {
        res.redirect("/user"); // Trang chủ nếu là người dùng thường
      }
    } catch (error) {
      res.render("account", { message: "Lỗi server. Vui lòng thử lại." });
    }
  },

  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Không thể hủy session:", err);
        return res.status(500).send("Đăng xuất thất bại. Vui lòng thử lại.");
      }
      res.clearCookie("connect.sid");
      res.redirect("/account"); // Chuyển hướng về trang đăng nhập
    });
  },
};

module.exports = accountControllers;
