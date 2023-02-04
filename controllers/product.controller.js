const upload = require("./../utill/upload");
const Product = require("./../models/peoduct.model");
const Order = require("../models/order.model");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const create = (req, res) => {
  upload(req, res, async (err2) => {
    if (err2) {
      console.log(err2);
      return res.status(500).json({ err: err2.message });
    }
    console.log("Here");
    console.log(req.body.name, req.body.price, " + " + req.body.file);
    if (!req.body.name || !req.body.price || !req.file) {
      return res
        .status(400)
        .json({ err: "All fields should be selected - name, price, file" });
    }
    console.log(2);

    if (isNaN(req.body.price)) {
      return res.status(400).json({ err: "Price must be a number" });
    }

    let productDetails = {
      name: req.body.name,
      price: req.body.price,
      content: req.file.path,
    };
    let createdProduct;
    try {
      createdProduct = await Product.create(productDetails);
    } catch (err) {
      return res.status(505).json({ Error: err });
    }

    return res
      .status(201)
      .json({ message: "Product created", "created product": createdProduct });
  });
};

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json({ Products: products });
  } catch (err) {
    return res.status(500).json({ Error: err });
  }
};

const buy = async (req, res) => {
  try {
    console.log(req.params);
    const product = await Product.findOne({
      where: { id: req.params.productID },
    });

    if (!product) {
      return res.status(404).json({ err: "Product not found" });
    }
    console.log(product);
    const orderDetails = {
      productID: product.dataValues.id,
      productName: product.dataValues.name,
      productPrice: product.dataValues.price,
      buyerID: req.user.dataValues.id,
      buyerEmail: req.user.dataValues.email,
    };

    let paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: "4242424242424242",
        exp_month: 9,
        exp_year: 2023,
        cvc: "314",
      },
    });

    let paymentIntent = await stripe.paymentIntents.create({
      amount: product.dataValues.price * 100,
      currency: "inr",
      payment_method_types: ["card"],
      payment_method: paymentMethod.id,
      confirm: true,
    });

    if (paymentIntent) {
      const createdOrder = await Order.create(orderDetails);
      return res
        .status(201)
        .json({ message: "Order created", createdOrder, paymentIntent });
    } else {
      return res.status(400).json({ err: "Something went wrong" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "failed", error: err });
  }
};

module.exports = { create, getAllProduct, buy };
