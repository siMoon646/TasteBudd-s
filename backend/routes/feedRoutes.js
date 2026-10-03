const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const feed = require('../controllers/feedController');

const router = express.Router();

router.get('/', optionalAuth, feed.getDefaultFeed);

module.exports = router;
