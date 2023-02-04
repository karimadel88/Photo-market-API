const express = require("express");
const userRouter = require("./routes/user.route");
const productRouter = require("./routes/product.route");
const { connectDB } = require("./config/db");
require("dotenv").config();
const app = express();

// // Middlwares
app.use(express.json());
express.static("Content");
app.use(express.urlencoded({ extended: true }));

// Main Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Done");
});
