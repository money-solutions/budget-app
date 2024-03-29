const express = require("express");
const router = express.Router();
const authenticateSession = require("../middleware/authenticateSession");
const { budgetCreate } = require("../controllers/budgetController");

router.post("/", authenticateSession, budgetCreate);

module.exports = router;
