// HTTP handlers for users. Controllers only translate between HTTP and the
// service layer: read params/body/req.user, call a service, send a response.

import * as userService from '../services/userService.js';


/**
 * POST /api/users
 * Signup — creates the app user for the authenticated account.
 * Body: { username, description? }. Uses req.user.id (the Supabase auth user id).
 * 201 with the created user.
 */
async function createUser(req, res) {
  // requireAuth sets username to null until the profile row exists
  if (req.user.username !== null) {
    return res.status(409).json({ error: 'Profile already exists' });
  }

  // following line is shorthand for 
  // const username = req.body.username; 
  // const description = req.body.description;
  const { username, description } = req.body ?? {};
  const user = await userService.createUser({ id: req.user.id, username, description });
  res.status(201).json(user);
}

/**
 * GET /api/users/:userId
 * 200 with the public profile, 404 if not found.
 */
async function getUserProfile(req, res) {
  const userId = req.params.userId;
  const profile = await userService.getUserProfile(userId);
  if (profile === null) {
    return res.status(404).json({error: 'Profile doesn\'t exist'});
  }
  res.status(200).json(profile);
}

/**
 * PATCH /api/users/:userId
 * Body: { username?, description? }.
 * 403 unless req.user.id === :userId. 200 with the updated user.
 */
async function updateUserProfile(req, res) {
  if (req.user.id !== req.params.userId){
    return res.status(403).json({error: 'forbidden'});
  }
  const userId = req.params.userId;
  const { username, description } = req.body ?? {};
  // taken username: Prisma throws P2002 (unique constraint fails) -> errorHandler sends 409
  const updatedUserProfile = await userService.updateUserProfile(userId, { username, description });
  res.status(200).json(updatedUserProfile);
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
