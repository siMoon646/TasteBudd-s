// Feed queries (docs/TODO.md → Feed).

/**
 * Engagement score for ranking the default feed.
 * Weights likes, comments, saves, and follows-from-post (weights TBD);
 * dislikes may count against it. Likely also decays with post age so the
 * feed doesn't get stuck on old popular posts.
 */
function scorePost(post) {
  throw new Error('Not implemented');
}

/**
 * Default feed: recent posts ranked by scorePost, paginated.
 * - Pull a candidate window (e.g. last N days), score, sort, then page.
 * - Score-ordered pages can't use a plain id cursor; an offset or a
 *   `(score, id)` cursor works to start.
 * Returns `{ posts, nextCursor }`.
 */
async function getDefaultFeed({ cursor, limit = 20, viewerId }) {
  throw new Error('Not implemented');
}

module.exports = { scorePost, getDefaultFeed };
