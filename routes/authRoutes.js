const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin, checkValidation } = require('../middleware/validation');
const { isGuest } = require('../middleware/auth');

router.get('/register', isGuest, authController.showRegisterForm);
router.post('/register', isGuest, validateRegistration, checkValidation, authController.register);

router.get('/login', isGuest, authController.showLoginForm);
router.post('/login', isGuest, validateLogin, checkValidation, authController.login);

router.get('/logout', authController.logout);

module.exports = router;
