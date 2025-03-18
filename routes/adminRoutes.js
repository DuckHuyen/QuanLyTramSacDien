//adminRouters.js

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Middleware to check admin authentication
const checkAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.loainguoidung === 2) {
    next();
  } else {
    res.redirect("/account/login");
  }
};

// Admin dashboard
router.get("/", checkAdmin, adminController.renderTramSac);
router.get("/tramsac", checkAdmin, adminController.renderTramSac);

// Chuẩn sạc routes
router.get("/chuansac", checkAdmin, adminController.renderChuanSac); // Thêm dòng này
router.post("/chuansac/create", checkAdmin, adminController.createChuanSac);
router.post("/chuansac/delete/:id", checkAdmin, adminController.deleteChuanSac);

// Trạm sạc routes
router.post("/tramsac/create", checkAdmin, adminController.createTramSac);
router.post("/tramsac/delete/:id", checkAdmin, adminController.deleteTramSac);

// Thành phố routes
router.post("/thanh-pho/create", checkAdmin, adminController.createThanhPho);

// Khu vực routes
router.post("/khu-vuc/create", checkAdmin, adminController.createKhuVuc);
router.get(
  "/khu-vuc/:maThanhPho",
  checkAdmin,
  adminController.getKhuVucByThanhPho
);

// Hãng xe routes
router.get("/hangxe", checkAdmin, adminController.renderHangXe); // Thêm dòng này
router.post("/hangxe/create", checkAdmin, adminController.createHangXe);
router.post("/hangxe/delete/:id", checkAdmin, adminController.deleteHangXe);

// Xe routes
router.get("/xe", checkAdmin, adminController.renderXe); // Thêm dòng này
router.post("/xe/create", checkAdmin, adminController.createXe);
router.post("/xe/delete/:id", checkAdmin, adminController.deleteXe);

module.exports = router;
