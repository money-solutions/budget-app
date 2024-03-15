const express = require("express");
const router = express.Router();
const authenticateSession = require("../middleware/authenticateSession");
const { postBudget } = require("../controllers/budgetController");

router.post("/", authenticateSession, postBudget);

module.exports = router;
