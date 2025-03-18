//accountRoutes.js

const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

router.get("/", (req, res) => {
  res.render("account", { message: null });
});
router.get("/logout", accountController.logout);

router.post("/register", accountController.register);
router.post("/login", accountController.login);

module.exports = router;
