const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("./../utill/valditors");
const { json } = require("sequelize");

const signUp = async (req, res) => {
  try {
    // MAIN DATA TO SIGNUP
    const { email, name, password, isSeller } = req.body;

    // Check user exist or no
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(403).json({
        Error: "User Already Exist",
      });
    }

    //  Valdition of Data
    if (!validateName(name)) {
      return res.status(400).json({
        Error: "Name Not Valid",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        Error: "Email Not Valid",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        Error: "Password Not Valid",
      });
    }

    // Encrypt Password
    const encryptPassword = await bcrypt.hash(password, 10);

    // Accept User
    const user = {
      name,
      password: encryptPassword,
      email,
      isSeller: isSeller || false,
    };

    const createdUser = await User.create(user);

    return res.status(201).json({
      success: "ok",
      userName: createdUser.name,
    });
  } catch (err) {
    return res.status(500).json({
      Error: err,
    });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check enter email and password or not
    if (email.length === 0) {
      return res.status(400).json({ Error: "Please enter your email" });
    }

    if (password.length === 0) {
      return res.status(400).json({ Error: "Please enter your password" });
    }

    // Check exist email in DB
    const existingUser = await User.findOne({ where: { email: email } });
    if (!existingUser) {
      return res.status(404).json({ Error: "User not found" });
    }

    // Compare Passowrd
    const passwordMatched = bcrypt.compare(password, existingUser.password);

    if (!passwordMatched) {
      return res.status(404).json({ Error: "Password Incorrect" });
    }

    // Sign in with save data in cookies to used it again
    const payload = { user: { id: existingUser.dataValues.id } };

    const bearerToken = await jwt.sign(payload, "KARIM ADEL", {
      expiresIn: 36000,
    });

    res.cookie("t", bearerToken, { expire: new Date() + 9999 });

    return res
      .status(200)
      .json({ message: "Signed In Successfully!", bearerToken: bearerToken });
  } catch (err) {
    return res.status(500).json({ Error: err });
  }
};

const signOut = async (req, res) => {
  try {
    res.clearCookie("t");
    return res.status(200).json({ message: "Signed out successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ Error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({ users: users });
  } catch (err) {
    return res.status(500).json({ Erorr: err });
  }
};

module.exports = { signIn, signUp, signOut, getAll };
