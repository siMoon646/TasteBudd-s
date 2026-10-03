// Mounts every resource router. In server.js: app.use('/api', require('./routes'))
const express = require('express');

const router = express.Router();

router.use('/users', require('./userRoutes'));
router.use('/posts', require('./postRoutes'));
router.use('/comments', require('./commentRoutes'));
router.use('/feed', require('./feedRoutes'));

module.exports = router;
