const express = require('express');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const posts = require('../controllers/postController');
const comments = require('../controllers/commentController');

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

module.exports = router;
