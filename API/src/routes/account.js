const express = require("express");
const router = express.Router();
const authenticateSession = require("../middleware/authenticateSession");
const { accountCreate, getAccounts } = require("../controllers/accountController");

router.post("/",authenticateSession, accountCreate);
router.get("/",authenticateSession, getAccounts);

module.exports = router;
