// HTTP handlers for posts and post reactions.

/**
 * POST /api/posts
 * Body: { caption?, images?, modules: [{ moduleType, position?, data }] }.
 * 201 with the created post.
 */
async function createPost(req, res) {
  throw new Error('Not implemented');
}

/**
 * GET /api/posts
 * Query: { userId?, cursor?, limit? }.
 * 200 with { posts, nextCursor }.
 */
async function listPosts(req, res) {
  throw new Error('Not implemented');
}

/**
 * GET /api/posts/:postId
 * 200 with the post (plus viewer's reactions if signed in), 404 if not found.
 */
async function getPost(req, res) {
  throw new Error('Not implemented');
}

/**
 * PATCH /api/posts/:postId
 * Body: { caption?, images?, modules? }. Author only.
 * 200 with the updated post.
 */
async function updatePost(req, res) {
  throw new Error('Not implemented');
}

/**
 * DELETE /api/posts/:postId
 * Author only. 204.
 */
async function deletePost(req, res) {
  throw new Error('Not implemented');
}

/**
 * PUT /api/posts/:postId/reactions/:type
 * :type is like | dislike | save. 204.
 */
async function addReaction(req, res) {
  throw new Error('Not implemented');
}

/**
 * DELETE /api/posts/:postId/reactions/:type
 * 204.
 */
async function removeReaction(req, res) {
  throw new Error('Not implemented');
}

export {
  createPost,
  listPosts,
  getPost,
  updatePost,
  deletePost,
  addReaction,
  removeReaction,
};
