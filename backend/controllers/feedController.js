// HTTP handlers for feeds.

/**
 * GET /api/feed
 * Query: { cursor?, limit? }. 200 with { posts, nextCursor }.
 */
async function getDefaultFeed(req, res) {
  throw new Error('Not implemented');
}

export { getDefaultFeed };
