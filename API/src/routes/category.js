const express = require("express");
const router = express.Router();
const authenticateSession = require("../middleware/authenticateSession");
const { categoryCreate } = require("../controllers/categoryController");

router.post("/", authenticateSession, categoryCreate);

module.exports = router;