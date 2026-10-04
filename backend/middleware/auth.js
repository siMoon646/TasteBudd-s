// Auth middleware. Auth is Supabase Auth: the frontend signs in with
// supabase-js and sends its access token; the backend only verifies it.

/**
 * Requires a signed-in user.
 * - Read the access token from `Authorization: Bearer <jwt>`.
 * - Verify it with Supabase (e.g. `supabase.auth.getUser(token)`, or check
 *   the JWT signature against the project's keys).
 * - Attach the matching app user to `req.user` ({ id, username }).
 * - Respond 401 if the token is missing or invalid.
 */
function requireAuth(req, res, next) {
  throw new Error('Not implemented');
}

/**
 * Same as requireAuth, but lets anonymous requests through.
 * Sets `req.user` when a valid token is present, leaves it undefined otherwise.
 * Useful for public reads that show extra info to signed-in users
 * (e.g. whether the viewer has liked/saved a post).
 */
function optionalAuth(req, res, next) {
  throw new Error('Not implemented');
}

export { requireAuth, optionalAuth };
