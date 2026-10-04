// Comment data access + business rules.

/**
 * Creates a comment on a post.
 * - Require `text` or `image` (at least one non-null).
 * - Throw 404 if the post doesn't exist.
 * - In one `prisma.$transaction`: create the comment, then
 *   counterService.adjustPostCommentCount(tx, postId, +1).
 * Returns the created comment with its author (id, username).
 */
async function createComment(postId, userId, { text, image }) {
  throw new Error('Not implemented');
}

/**
 * Lists a post's comments, oldest first, with cursor pagination
 * (same `{ items, nextCursor }` pattern as postService.listPosts).
 * Include each comment's author (id, username).
 */
async function listCommentsByPost(postId, { cursor, limit = 20 }) {
  throw new Error('Not implemented');
}

/**
 * Deletes a comment.
 * - Throw 404 if not found, 403 if `userId` isn't the comment's author.
 * - In one `prisma.$transaction`: delete the comment (its reactions cascade),
 *   then counterService.adjustPostCommentCount(tx, postId, -1).
 */
async function deleteComment(commentId, userId) {
  throw new Error('Not implemented');
}

export { createComment, listCommentsByPost, deleteComment };
