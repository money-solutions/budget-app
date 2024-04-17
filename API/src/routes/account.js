const express = require("express");
const router = express.Router();
const authenticateSession = require("../middleware/authenticateSession");
const { accountCreate, getAccounts, accountDelete, accountEdit } = require("../controllers/accountController");

router.post("/",authenticateSession, accountCreate);
router.get("/",authenticateSession, getAccounts);
router.delete("/",authenticateSession, accountDelete);
router.put("/", authenticateSession, accountEdit);

module.exports = router;
