const {
  getAll,
  create,
  remove,
  update,
} = require("../controllers/cart.controller");
const express = require("express");
const verifyJWT = require("../utils/verifyJWT");

const cartRouter = express.Router();

cartRouter.route("/").get(verifyJWT, getAll).post(verifyJWT, create);

cartRouter.route("/:id").delete(verifyJWT, remove).put(verifyJWT, update);

module.exports = cartRouter;
