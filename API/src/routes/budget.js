const express = require("express");
const router = express.Router();
const authenticateSession = require("../middleware/authenticateSession");
const { budgetCreate, budgetGet, budgetYearsGet } = require("../controllers/budgetController");

router.post("/", authenticateSession, budgetCreate);
router.get("/", authenticateSession, budgetGet);
router.get("/years/", authenticateSession, budgetYearsGet);

module.exports = router;
