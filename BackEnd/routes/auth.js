const express = require("express");
const router = express.Router();

const auth = require("../middleware/verify");

// Load Controllers
const {
  googleLogin,
  registration,
  activateAccount,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

// Google Login
router.post("/googlelogin", googleLogin);
router.post("/register", registration);
router.post("/login", login);
router.post("/emailverification", activateAccount);
router.put("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);

module.exports = router;
