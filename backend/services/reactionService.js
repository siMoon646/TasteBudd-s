// Reaction data access + business rules.
//
// Adds and removes are idempotent: adding a reaction that already exists, or
// removing one that doesn't, succeeds without touching counters. Every
// add/remove that actually changes a row updates the matching counter in the
// same `prisma.$transaction` (see counterService).
//
// Open question (docs/DATA_DICTIONARY.md → reactions): a user can currently hold
// both a like and a dislike on the same target. If votes should be mutually
// exclusive, adding one should also remove the other in the same transaction.

/**
 * Adds a like/dislike/save to a post.
 * - Reject any other `type` with 400. Throw 404 if the post doesn't exist.
 * - In one transaction: create the Reaction (postId set, commentId and
 *   targetUserId null), then adjustPostReactionCount(tx, postId, type, +1).
 *   Skip the increment if the row already existed.
 */
async function addPostReaction(userId, postId, type) {
  throw new Error('Not implemented');
}

/**
 * Removes a like/dislike/save from a post.
 * In one transaction: delete the Reaction, and if a row was deleted,
 * adjustPostReactionCount(tx, postId, type, -1).
 */
async function removePostReaction(userId, postId, type) {
  throw new Error('Not implemented');
}

/**
 * Adds a like/dislike to a comment. Same pattern as addPostReaction, using
 * commentId and adjustCommentReactionCount. Reject 'save' and 'follow'.
 */
async function addCommentReaction(userId, commentId, type) {
  throw new Error('Not implemented');
}

/**
 * Removes a like/dislike from a comment. Same pattern as removePostReaction.
 */
async function removeCommentReaction(userId, commentId, type) {
  throw new Error('Not implemented');
}

/**
 * Follows a user: create a Reaction with type 'follow' and targetUserId set.
 * - Reject following yourself with 400. Throw 404 if the target doesn't exist.
 * - No counter to update (follows aren't cached).
 */
async function followUser(userId, targetUserId) {
  throw new Error('Not implemented');
}

/**
 * Unfollows a user: delete the matching 'follow' Reaction if it exists.
 */
async function unfollowUser(userId, targetUserId) {
  throw new Error('Not implemented');
}

module.exports = {
  addPostReaction,
  removePostReaction,
  addCommentReaction,
  removeCommentReaction,
  followUser,
  unfollowUser,
};
