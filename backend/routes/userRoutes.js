import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as users from '../controllers/userController.js';

const router = express.Router();

router.post('/', requireAuth, users.createUser);
router.get('/:userId', users.getUserProfile);
router.patch('/:userId', requireAuth, users.updateUserProfile);

router.put('/:userId/follow', requireAuth, users.followUser);
router.delete('/:userId/follow', requireAuth, users.unfollowUser);

export default router;
