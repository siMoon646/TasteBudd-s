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
  // userId is invalid:
  if (typeof userId !== 'string' || !userId.trim()){
    // the controller will check for 'falsey' (null) value and send a 404
    return null;
  }

  // finds a user with userId and specified fields (id, username, description, and createdAt)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, description: true, createdAt: true },
  });

  // Legal id finds a null user -> return null -> controller will see falsey value and send a 404
  if (!user) {
    return null;
  }
  
  // Counts the number of rows in the reaction table where the reaction type is 'follow' targeting the specified user.
  const followerCount = await prisma.reaction.count({
    where: { type: 'follow', targetUserId: userId },
  });
  // Counts the number of rows in the reactio ntable where the reaction type is 'follow' originating FROM the specified user.
  const followingCount = await prisma.reaction.count({
    where: { type: 'follow', userId: userId },
  });

  // copies the user object from the earlier prisma query into the return object:
  return { ...user, followerCount, followingCount };
  // return statement equivalent to: 
  /*
        return {
        id: '<exampleId>>',
        username: 'sampleUser',
        description: 'sampleDescription',
        createdAt: '2026-10-21',
        followerCount: 24,
        followingCount: 12,
        };
   */
}

/**
 * Updates the editable profile fields (`username`, `description` only).
 * Caller must already have checked that the requester is this user.
 * Returns the updated user.
 */
async function updateUserProfile(userId, { username, description }) {
  // if the username is undefined -> proceed -> not modifying username
  // if the username is defined, and is not a string -> throw error
  // if username is trimmed and comes up empty, then username is illegal -> throw error
  if (username !== undefined && (typeof username !== 'string' || !username.trim())) {
    throw httpError(400, 'username must be a string');
  }

  // description is undefined or null -> skip check (undefined = don't modify, null = clear bio)
  // description is defined, and is not a string -> throw error
  if (description != null && typeof description !== 'string') {
    throw httpError(400, 'description must be a string');
  }

  return prisma.user.update({
    // modifying data for username and bio only
    data: {
      username: username?.trim(),
      // description undefined -> do not modify
      // description is not undefined, but is falsy -> null (clear bio)
      // description non-blank -> modify bio to new bio
      description: description === undefined ? undefined : description?.trim() || null,
    }, 
    // modifying row with specified id
    where: {
      id: userId,
    },
  });
}

export { createUser, getUserProfile, updateUserProfile };
