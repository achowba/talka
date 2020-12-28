const path = require('path');
const express = require('express');
const router = express.Router();

const { isAuth } = require('../middleware/auth.middleware');
const publicPath = path.join(__dirname, '../public');

router.use('/auth', require('./auth.routes'));
router.use('/', isAuth, express.static(publicPath), require('./home.routes'));

module.exports = router;
