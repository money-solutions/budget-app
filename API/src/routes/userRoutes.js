const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUserById);

router.post('/login', userController.login);

router.post('signup', userController.createUser);

router.delete('/:username', userController.deleteUser);

module.exports = router;