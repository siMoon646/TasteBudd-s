import express from 'express';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import * as posts from '../controllers/postController.js';
import * as comments from '../controllers/commentController.js';

const router = express.Router();

router.post('/', requireAuth, posts.createPost);
router.get('/', optionalAuth, posts.listPosts);
router.get('/:postId', optionalAuth, posts.getPost);
router.patch('/:postId', requireAuth, posts.updatePost);
router.delete('/:postId', requireAuth, posts.deletePost);

router.put('/:postId/reactions/:type', requireAuth, posts.addReaction);
router.delete('/:postId/reactions/:type', requireAuth, posts.removeReaction);

// Comments are created/listed under their post.
router.post('/:postId/comments', requireAuth, comments.createComment);
router.get('/:postId/comments', comments.listComments);

export default router;
