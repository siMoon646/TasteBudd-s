// Post data access + business rules.

import * as moduleService from './moduleService.js';
import prisma from '../lib/db.js';
import httpError from '../lib/httpError.js';

// feed cards: just the author. Used in `createPost`, `getPostById`, and `updatePost`
const postPreviewInclude = {
  user: { select: { id: true, username: true } },
};

/**
 * Creates a post with its modules in one nested Prisma create.
 * - Require a non-empty `caption` or at least one entry in `images`
 *   (app-enforced; the DB allows both empty).
 * - Run `modules` through moduleService.prepareModules first.
 * Returns the created post including its modules ordered by position.
 */
async function createPost(userId, { caption, images, modules }) {
  // type checks first, so .trim() below only ever runs on a string
  if (caption !== undefined && typeof caption !== 'string') {
    throw httpError(400, 'caption must be a string');
  }
  // if images were sent, make sure that they are an array, and that array contains only strings
  if (images !== undefined && (!Array.isArray(images) || !images.every(item => typeof item === 'string'))) {
    throw httpError(400, 'images must be an array of strings');
  }
  // app-level check to make sure at least one caption or image is present
  // by this point, we would know that any captions are strings, and any images are arrays containing only strings
  if (!caption?.trim() && !images?.length) {
    throw httpError(400, 'post needs a caption or at least one image');
  }
  const post = await prisma.post.create({
    data: {
      userId : userId,
      caption : caption?.trim() ? caption : undefined,
      images : images ? images : undefined,
      modules: modules ? { create: moduleService.prepareModules(modules) } : undefined,
    },
    include : {
      modules : { orderBy : { position: 'asc'}}
    }
  }); 
  return post;
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
  // query params come from the URL, so reject anything that isn't the expected
  // type (e.g. ?userId=a&userId=b arrives as an array)
  if (userId !== undefined && typeof userId !== 'string') {
    throw httpError(400, 'provided userId must be string');
  }
  if (cursor !== undefined && typeof cursor !== 'string') {
    throw httpError(400, 'provided cursor must be string');
  }
  // limit defaults to 20. Must be at least 1: with 0, hasMore can be true
  // while posts is empty, and reading the last post's id below would crash
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    throw httpError(400, 'limit must be an integer from 1 to 50');
  }

  const query = {
    // a profile page passes userId; the feed leaves it out to get everyone's posts
    where: { userId: userId ? userId : undefined },

    // author info for the feed card; only the fields the UI needs
    include: { user: { select: { id: true, username: true } } },

    // id breaks ties between posts with the same createdAt, so the order
    // never changes between requests and the cursor can't skip or repeat posts
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],

    // one extra row tells us whether another page exists
    take: limit + 1,
  };

  // after the first page, start at the cursor post (the last one the client
  // already has) and skip it so it isn't sent twice
  if (cursor) {
    query.cursor = { id: cursor };
    query.skip = 1;
  }

  const rows = await prisma.post.findMany(query);

  // getting the extra row back means at least one more post exists after this page
  const hasMore = rows.length > limit;
  // drop the extra row; it will be the first post of the next page
  const posts = hasMore ? rows.slice(0, limit) : rows;
  // the client sends this back as `cursor` for the next page; null means last page
  const nextCursor = hasMore ? posts[posts.length - 1].id : null;
  return { posts, nextCursor };
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
