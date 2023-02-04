const { Sequelize } = require("sequelize");

const createDB = new Sequelize("test-db", "user", "pass", {
  dialect: "sqlite",
  host: "./config/db.sqlite",
});

const connectDB = () => {
  createDB
    .sync()
    .then((res) => {
      console.log("Successfully connected to database");
    })
    .catch((err) => console.log("Cannot connect to database due to:", err));
};

// const userModel = require("./../models/user.model");
// const orderModel = require("./../models/order.model");

// orderModel.belongsTo(userModel, { foreignKey: "buyerID" });
// userModel.hasMany(orderModel, { foreignKey: "id" });

module.exports = { createDB, connectDB };
