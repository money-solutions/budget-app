const express = require("express");
const router = express.Router();
const authenticateSession = require("../middleware/authenticateSession");
const { categoryCreate, categoryGet } = require("../controllers/categoryController");

router.post("/", authenticateSession, categoryCreate);
router.get("/", authenticateSession, categoryGet);

module.exports = router;