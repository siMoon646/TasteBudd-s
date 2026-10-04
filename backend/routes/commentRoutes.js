import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as comments from '../controllers/commentController.js';

const router = express.Router();

// Create/list live under /posts/:postId/comments (see postRoutes.js).
router.delete('/:commentId', requireAuth, comments.deleteComment);

router.put('/:commentId/reactions/:type', requireAuth, comments.addReaction);
router.delete('/:commentId/reactions/:type', requireAuth, comments.removeReaction);

export default router;
