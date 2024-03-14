const express = require('express');
const router = express.Router();
const { logout } = require('../controllers/logoutController');
const authenticateSession = require('../middleware/authenticateSession');


router.post('/',authenticateSession, logout)

module.exports = router;