const User = require("../models/User.js");
const { hash, compare } = require("bcrypt");
const { createToken } = require("../utils/token-manager.js");
const { token } = require("morgan");

const getAllUsers = async (req, res, next) => {
  try {
    // get all users
    const users = await User.find();
    return res.status(200).json({ message: "OK", users });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

const userSignup = async (req, res, next) => {
  try {
    //user signup
    const { name, email, password , role} = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).send("User already registered");
    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword , role});
    await user.save();

    
    const token = createToken(user._id.toString(), user.email, "18d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 18);
    res.cookie( process.env.JWT_TOKEN_NAME,token ,{
      path: "/",
      domain: "localhost",
      expires ,
      httpOnly: true,
    });
    //create token and stoe cookie
  
    return res
      .status(201)
      .json({ message: "OK", name: user.name, email: user.email, token });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

const userLogin = async (req, res, next) => {
  try {
    //user login
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {return res.status(401).send("User not registered");}
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) { return res.status(403).send("Incorrect Password");}

    const token = createToken(user._id.toString(), user.email, "18d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 18);
    res.cookie( process.env.JWT_TOKEN_NAME,token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
    });

    // create token and store cookie
    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email, role: user.role });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

const verifyUser = async (req, res, next) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res.status(401).send("User not registered OR Token malfunctioned");
    if (user._id.toString() !== res.locals.jwtData.id)
      return res.status(401).send("Permissions didn't match");
    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

const userLogout = async (req, res, next) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res.status(401).send("User not registered OR Token malfunctioned");
    if (user._id.toString() !== res.locals.jwtData.id)
      return res.status(401).send("Permissions didn't match");
    // create token and store cookie
    res.clearCookie(process.env.JWT_TOKEN_NAME,token, {
      httpOnly: true,
      domain: "localhost",
      path: "/",
    });
    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

module.exports = {
  getAllUsers,
  userSignup,
  userLogin,
  verifyUser,
  userLogout,
};
