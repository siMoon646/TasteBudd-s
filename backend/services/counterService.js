// Shared counter-sync helpers (docs/TODO.md → Core API → Cross-cutting).
//
// Every function takes a Prisma transaction client `tx` instead of the global
// client, so callers can compose them into a larger `prisma.$transaction`
// together with the Reaction/Comment row write. See docs/ARCHITECTURE.md →
// Data integrity rules: a counter change must never commit without its source row change.

/**
 * Adjusts one of a post's reaction counters by `delta` (+1 or -1).
 * - `type` is a ReactionType valid on posts: 'like' → likeCount,
 *   'dislike' → dislikeCount, 'save' → saveCount.
 * - Use Prisma's atomic `{ increment: delta }` rather than read-then-write.
 * - Throw for 'follow' (follows have no cached count).
 */
async function adjustPostReactionCount(tx, postId, type, delta) {
  throw new Error('Not implemented');
}

/**
 * Adjusts one of a comment's reaction counters by `delta` (+1 or -1).
 * - `type` is 'like' → likeCount or 'dislike' → dislikeCount.
 * - Throw for 'save' / 'follow' (not valid on comments).
 */
async function adjustCommentReactionCount(tx, commentId, type, delta) {
  throw new Error('Not implemented');
}

/**
 * Adjusts a post's commentCount by `delta` (+1 or -1).
 */
async function adjustPostCommentCount(tx, postId, delta) {
  throw new Error('Not implemented');
}

module.exports = {
  adjustPostReactionCount,
  adjustCommentReactionCount,
  adjustPostCommentCount,
};
