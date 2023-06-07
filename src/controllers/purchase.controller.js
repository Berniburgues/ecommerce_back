const catchError = require("../utils/catchError");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const User = require("../models/User");
const Cart = require("../models/Cart");
const ProductImg = require("../models/ProductImg");

const getAll = catchError(async (req, res) => {
  const userId = req.user.id;
  const results = await Purchase.findAll({
    include: [
      {
        model: Product,
        attributes: ["title", "brand", "price"],
        include: {
          model: ProductImg,
        },
      },
      {
        model: User,
        attributes: ["firstName", "lastName", "email", "phone"],
      },
    ],
    where: { userId },
  });
  return res.json(results);
});

const buyCart = catchError(async (req, res) => {
  const userId = req.user.id;
  const products = await Cart.findAll({
    include: Product,
    where: { userId },
    attributes: ["userId", "productId", "quantity"],
    raw: true,
  });
  await Purchase.bulkCreate(products);
  await Cart.destroy({
    where: { userId },
  });
  return res.status(201).json(products);
});

module.exports = {
  getAll,
  buyCart,
};
