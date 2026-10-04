// Post data access + business rules.

/**
 * Creates a post with its modules in one nested Prisma create.
 * - Require a non-empty `caption` or at least one entry in `images`
 *   (app-enforced; the DB allows both empty).
 * - Run `modules` through moduleService.prepareModules first.
 * Returns the created post including its modules ordered by position.
 */
async function createPost(userId, { caption, images, modules }) {
  throw new Error('Not implemented');
}

/**
 * Returns one post with its author (id, username) and modules ordered by
 * position, or null if not found.
 * If `viewerId` is given, also include which reactions the viewer has on it
 * (like/dislike/save) so the UI can highlight them.
 */
async function getPostById(postId, viewerId) {
  throw new Error('Not implemented');
}

/**
 * Lists posts, newest first, with cursor pagination.
 * - Filter by `userId` when given (a profile's posts).
 * - `cursor` is the id of the last post from the previous page; fetch
 *   `limit + 1` rows to know whether there's a next page.
 * Returns `{ posts, nextCursor }` (`nextCursor` null on the last page).
 */
async function listPosts({ userId, cursor, limit = 20 }) {
  throw new Error('Not implemented');
}

/**
 * Updates a post's caption, images, and/or modules.
 * - Throw 404 if the post doesn't exist, 403 if `userId` isn't the author.
 * - Re-check the caption-or-images rule against the merged result.
 * - If `modules` is given, replace them all in one transaction
 *   (deleteMany then createMany) — simpler than diffing.
 * Returns the updated post with modules.
 */
async function updatePost(postId, userId, { caption, images, modules }) {
  throw new Error('Not implemented');
}

/**
 * Deletes a post.
 * - Throw 404 if not found, 403 if `userId` isn't the author.
 * - Modules, comments, and reactions are removed by onDelete: Cascade; no
 *   counter updates needed since the whole subtree goes away together.
 * - Images in Cloudinary should be cleaned up after the delete commits.
 */
async function deletePost(postId, userId) {
  throw new Error('Not implemented');
}

export { createPost, getPostById, listPosts, updatePost, deletePost };
