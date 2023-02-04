const express = require("express");
const {
  create,
  getAllProduct,
  buy,
} = require("../controllers/product.controller");
const { isAusth, isSeller, isBuyer } = require("../middlwares/auth");
const productRouter = express.Router();

productRouter.post("/create", isAusth, isSeller, create);
productRouter.get("/products", getAllProduct);
productRouter.post("/buy/:productID", isAusth, isBuyer, buy);

module.exports = productRouter;
