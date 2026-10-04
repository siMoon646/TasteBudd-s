// HTTP handlers for users. Controllers only translate between HTTP and the
// service layer: read params/body/req.user, call a service, send a response.

/**
 * POST /api/users
 * Signup — creates the app user for the authenticated account.
 * Body: { username, description? }. Uses req.user.id (the Supabase auth user id).
 * 201 with the created user.
 */
async function createUser(req, res) {
  throw new Error('Not implemented');
}

/**
 * GET /api/users/:userId
 * 200 with the public profile, 404 if not found.
 */
async function getUserProfile(req, res) {
  throw new Error('Not implemented');
}

/**
 * PATCH /api/users/:userId
 * Body: { username?, description? }.
 * 403 unless req.user.id === :userId. 200 with the updated user.
 */
async function updateUserProfile(req, res) {
  throw new Error('Not implemented');
}

/**
 * PUT /api/users/:userId/follow
 * Follow :userId as req.user. 204.
 */
async function followUser(req, res) {
  throw new Error('Not implemented');
}

/**
 * DELETE /api/users/:userId/follow
 * Unfollow :userId as req.user. 204.
 */
async function unfollowUser(req, res) {
  throw new Error('Not implemented');
}

export {
  createUser,
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
};
