//userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Middleware to check admin authentication
const checkUser = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/account/login");
  }
};

router.get("/", checkUser, userController.renderUserMap);
router.get("/info", checkUser, userController.renderUserInfo);
router.post("/update-car", checkUser, userController.updateUserCar);
router.post("/add-car", checkUser, userController.addUserCar);
router.post("/delete-car", checkUser, userController.deleteUserCar);

module.exports = router;
