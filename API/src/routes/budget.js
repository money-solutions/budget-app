const express = require('express');
const router = express.Router();
const authenticateSession = require('../middleware/authenticateSession');
const { createBudget } = require('../controllers/budgetController');


router.post('/', authenticateSession, login)

module.exports = router;