// HTTP handlers for comments and comment reactions.

/**
 * POST /api/posts/:postId/comments
 * Body: { text?, image? }. 201 with the created comment.
 */
async function createComment(req, res) {
  throw new Error('Not implemented');
}

/**
 * GET /api/posts/:postId/comments
 * Query: { cursor?, limit? }. 200 with { comments, nextCursor }.
 */
async function listComments(req, res) {
  throw new Error('Not implemented');
}

/**
 * DELETE /api/comments/:commentId
 * Comment author only. 204.
 */
async function deleteComment(req, res) {
  throw new Error('Not implemented');
}

/**
 * PUT /api/comments/:commentId/reactions/:type
 * :type is like | dislike. 204.
 */
async function addReaction(req, res) {
  throw new Error('Not implemented');
}

/**
 * DELETE /api/comments/:commentId/reactions/:type
 * 204.
 */
async function removeReaction(req, res) {
  throw new Error('Not implemented');
}

module.exports = {
  createComment,
  listComments,
  deleteComment,
  addReaction,
  removeReaction,
};
