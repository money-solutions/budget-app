const express = require('express');
const router = express.Router();
const { getAccounts } = require('../controllers/getAccountsController');


router.get('/', getAccounts)

module.exports = router;