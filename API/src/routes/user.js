const express = require("express");
const router = express.Router();
const { signup, login, logout} = require('../controllers/userController');
const authenticateSession = require("../middleware/authenticateSession");

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", authenticateSession, logout);

module.exports = router;
