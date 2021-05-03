const express = require("express");
const router = express.Router();

const { requireSignin, isAuth } = require("../controller/auth.controller");
const { userById } = require("../controller/user.controller");
const { generateToken, processPayment } = require("../controller/braintree.controller");

router.get("/getToken/:userId", requireSignin, isAuth, generateToken);
router.post(
    "/payment/:userId",
    requireSignin,
    isAuth,
    processPayment
);

router.param("userId", userById);

module.exports = router;