const express = require('express');
const passport = require('passport');

const router = express.Router();

const { isNotAuth } = require('../middleware/auth.middleware');
const AuthController = require('../controllers/auth.controller');

router.get('/login', isNotAuth, AuthController.renderLoginPage);
router.get('/register', isNotAuth, AuthController.renderRegisterPage);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
}));
router.post('/register', AuthController.register);
router.get('/logout', AuthController.logout);
// router.post('/login', AuthController.login);

module.exports = router;
