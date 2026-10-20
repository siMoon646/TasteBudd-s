// User data access + business rules. Account deletion isn't built yet, so
// there's intentionally no deleteUser here (see docs/ARCHITECTURE.md →
// Data integrity rules).

import prisma from '../lib/db.js';

/** Builds an error that errorHandler turns into this HTTP status. */
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

/**
 * Creates the app user row at signup.
 * - Called after Supabase Auth creates the account; `id` is the Supabase
 *   auth user id (see the comment on User.id).
 * - `username` must be unique; let the P2002 error bubble up as a 409.
 * Returns the created user.
 */
async function createUser({ id, username, description }) {
  // Basic checks until Zod validation (middleware/validate.js) is set up
  if (typeof username !== 'string' || !username.trim()) {
    throw httpError(400, 'username is required');
  }
  if (description != null && typeof description !== 'string') {
    throw httpError(400, 'description must be a string');
  }

  return prisma.user.create({
    data: {
      id: id,
      username: username.trim(),
      description: description?.trim() || null, // store blank bios as null
    },
  });
}

/**
 * Returns a public profile, or null if the user doesn't exist.
 * Include: id, username, description, createdAt, and follower/following
 * counts (count Reaction rows with type 'follow' on targetUserId / userId,
 * since follows have no cached counter).
 */
async function getUserProfile(userId) {
  throw new Error('Not implemented');
}

/**
 * Updates the editable profile fields (`username`, `description` only).
 * Caller must already have checked that the requester is this user.
 * Returns the updated user.
 */
async function updateUserProfile(userId, { username, description }) {
  throw new Error('Not implemented');
}

export { createUser, getUserProfile, updateUserProfile };
