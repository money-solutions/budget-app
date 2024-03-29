const express = require("express");
const router = express.Router();
const { userSignup, userLogin, userLogout, userDelete } = require("../controllers/userController");
const authenticateSession = require("../middleware/authenticateSession");

router.post("/login", userLogin);
router.post("/signup", userSignup);
router.post("/logout", authenticateSession, userLogout);
router.delete("/", authenticateSession, userDelete);

module.exports = router;
