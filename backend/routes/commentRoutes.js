const express = require('express');
const { requireAuth } = require('../middleware/auth');
const comments = require('../controllers/commentController');

const router = express.Router();

// Create/list live under /posts/:postId/comments (see postRoutes.js).
router.delete('/:commentId', requireAuth, comments.deleteComment);

router.put('/:commentId/reactions/:type', requireAuth, comments.addReaction);
router.delete('/:commentId/reactions/:type', requireAuth, comments.removeReaction);

module.exports = router;
