const express = require("express");
const userRouter = require("./user.router");
const cartRouter = require("./cart.router");
const categoryRouter = require("./category.router");
const productRouter = require("./product.router");
const productImgRouter = require("./productImg.router");
const purchaseRouter = require("./purchase.router");
const router = express.Router();

// colocar las rutas aquí
router.use("/users", userRouter);
router.use("/cart", cartRouter);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/products_images", productImgRouter);
router.use("/purchases", purchaseRouter);

module.exports = router;
