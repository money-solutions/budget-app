const express = require("express");
const router = express.Router();
const { userSignup, userLogin, userLogout, userDelete, userUpdate, userGet } = require("../controllers/userController");
const authenticateSession = require("../middleware/authenticateSession");

router.get("/", authenticateSession, userGet);
router.post("/login", userLogin);
router.post("/signup", userSignup);
router.post("/logout", authenticateSession, userLogout);
router.put("/", authenticateSession, userUpdate)
router.delete("/", authenticateSession, userDelete);

module.exports = router;
