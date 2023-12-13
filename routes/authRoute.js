const express = require("express");
const { createUser, loginUserCtrl, getallUser, getaUser, deleteaUser, handleRefreshToken, loginAdmin } = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router()


router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.get("/allUsers", getallUser);
router.get("/:id", authMiddleware, isAdmin ,getaUser);
router.delete("/:id", deleteaUser);
router.get("/refresh", handleRefreshToken);
module.exports = router;