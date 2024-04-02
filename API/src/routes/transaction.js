const express = require("express");
const router = express.Router();
const authenticateSession = require("../middleware/authenticateSession");
const { transactionCreate, getTransactions, transactionDelete, transactionEdit } = require("../controllers/transactionController");

router.post("/",authenticateSession, transactionCreate);
router.get("/",authenticateSession, getTransactions);
router.delete("/",authenticateSession, transactionDelete);
router.put("/", authenticateSession, transactionEdit);

module.exports = router;
