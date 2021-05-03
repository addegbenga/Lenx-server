const express = require("express");
const router = express.Router();

const {
    create,
    productById,
    read,
    remove,
    update,
    list,
    listRelated,
    listCategories,
    listBySearch,
    photo, 
    listSearch
} = require("../controller/product.controller");
const { requireSignin, isAuth, isAdmin } = require("../controller/auth.controller");
const { userById } = require("../controller/user.controller");

const { uploadImage } = require("../middlewares/cloudinary");

router.get("/:productId", read);
router.post("/create/:userId", requireSignin, isAuth, isAdmin, uploadImage, create);
router.delete(
    "/:productId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);
router.put(
    "/:productId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update
);

router.get("/", list);
router.get("/search", listSearch);
router.get("/related/:productId", listRelated);
router.get("/categories", listCategories);
router.post("/by/search", listBySearch);
router.get("/photo/:productId", photo);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;