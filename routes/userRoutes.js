const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController');

// Registration
router.post('/register', userController.registerUser);

// Login
router.post('/login', loginController.loginUser);

module.exports = router;
