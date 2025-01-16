const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, secretKey, { expiresIn: "3d" });
};

const resgisterUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    let user = await userModel.findOne({ email });

    if (user) return res.status(400).json("User with given email exists!");

    if (!name || !email || !password)
      return res.status(400).json("All user information is required");

    if (!validator.isEmail(email))
      return res.status(400).json("Email must be valid.");

    if (!validator.isStrongPassword(password))
      return res.status(400).json("Password should be strong...");

    user = new userModel({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  let { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });
    if (!user) return res.status(400).json("Invalid user email.");

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) return res.status(400).json("Invalid password.");
    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUser = async (req, res) => {
  let userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
module.exports = { resgisterUser, loginUser, findUser, getUsers };
