const express = require("express");
const router = express.Router();
const authenticateSession = require("../middleware/authenticateSession");
const { budgetCreate, budgetGet } = require("../controllers/budgetController");

router.post("/", authenticateSession, budgetCreate);
router.get("/", authenticateSession, budgetGet);

module.exports = router;
