const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken.js");
const validateMongoById = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken.js");
const jwt = require("jsonwebtoken");
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
//FC P/ LOGIN USER
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //fc p/controlar si el usuario existe o no
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
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
//LOGIN ADMIN
const loginAdmin = asyncHandler(async (req, res) => {
  const {email, password} = req.body;
  //controlo si el usuario existe
  const findAdmin = await User.findOne({email});
  if (!findAdmin) {
    throw new Error("Usuario no encontrado");
}

if (findAdmin.role && findAdmin.role !== "admin") {
    throw new Error("No estás autorizado");
}
  if (findAdmin && (await findAdmin.isPasswordMatched(password))){
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
})
//MANEJO DEL REFRESH TOKEN
const handleRefreshToken = asyncHandler(async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new Error("No se proporcionó el token de actualización");
    }
    const userId = await verifyRefreshToken(refreshToken);
    const accessToken = await signAccessToken(userId);
    const refToken = await signRefreshToken(userId);
    res.json({ accessToken, refreshToken: refToken });
  } catch (error) {
    next(error);
  }
});


//OBTENER TODOS LOS USUARIOS
const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    console.error(error);
    throw new Error("error");
  }
});
//OBTENER UN USUARIO
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    validateMongoById(id);

    const getUser = await User.findById(id);
    res.json({getUser});
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: 'fail', message: 'Error al procesar la solicitud' });
  }
});
//ELIMINAR UN USUARIO
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (error) {
    throw new Error("error");
  }
});
module.exports = {
  createUser,
  loginUserCtrl,
  loginAdmin,
  getallUser,
  getaUser,
  deleteaUser,
  handleRefreshToken,
};
