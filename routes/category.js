const express = require("express");
const router = express.Router();

const {
    create,
    categoryById,
    read,
    update,
    remove,
    list
} = require("../controller/category.controller");
const { requireSignin, isAuth, isAdmin } = require("../controller/auth.controller");
const { userById } = require("../controller/user.controller");

router.get("/:categoryId", read);
router.post("/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put(
    "/:categoryId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update
);
router.delete(
    "/:categoryId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);
router.get("/categories", list);

router.param("categoryId", categoryById);
router.param("userId", userById);

module.exports = router;