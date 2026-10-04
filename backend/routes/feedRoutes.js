import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import * as feed from '../controllers/feedController.js';

const router = express.Router();

router.get('/', optionalAuth, feed.getDefaultFeed);

export default router;
