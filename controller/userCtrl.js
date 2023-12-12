const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken.js");
//FC P/ CREAR UN USUARIO NUEVO
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("El usuario ya existe");
  }
});
//FC P/ LOGIN
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //fc p/controlar si el usuario existe o no
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Algo estás haciendo mal");
  }
});
//OBTENER TODOS LOS USUARIOS
const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error("error");
  }
});
//OBTENER UN USUARIO

module.exports = { createUser, loginUserCtrl, getallUser };
