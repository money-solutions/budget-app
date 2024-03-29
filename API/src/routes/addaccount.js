const express = require('express');
const router = express.Router();
const { addAccount } = require('../controllers/addAccountController');


router.post('/', addAccount)

module.exports = router;