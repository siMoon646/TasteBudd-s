const express = require('express');
const { requireAuth } = require('../middleware/auth');
const users = require('../controllers/userController');

const router = express.Router();

router.post('/', requireAuth, users.createUser);
router.get('/:userId', users.getUserProfile);
router.patch('/:userId', requireAuth, users.updateUserProfile);

router.put('/:userId/follow', requireAuth, users.followUser);
router.delete('/:userId/follow', requireAuth, users.unfollowUser);

module.exports = router;
