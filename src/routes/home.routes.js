const express = require('express');

const router = express.Router();
const { isAuth } = require('../middleware/auth.middleware');
const HomeController = require('../controllers/home.controller');

router.get('/', isAuth, HomeController.renderUsers);
router.get('/me', isAuth, HomeController.renderProfile);
router.get('/chat/:id', isAuth, HomeController.renderChat);

module.exports = router;
