const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controller/auth.controller");
const { userById, addOrderToUserHistory } = require("../controller/user.controller");
const {
    create,
    listOrders,
    getStatusValues,
    orderById,
    updateOrderStatus
} = require("../controller/order.controller");
const { decreaseQuantity } = require("../controller/product.controller");

router.post(
    "/create/:userId",
    requireSignin,
    isAuth,
    addOrderToUserHistory,
    decreaseQuantity,
    create
);

router.get("/list/:userId", requireSignin, isAuth, isAdmin, listOrders);
router.get(
    "/status-values/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    getStatusValues
);
router.put(
    "/:orderId/status/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    updateOrderStatus
);

router.param("userId", userById);
router.param("orderId", orderById);

module.exports = router;