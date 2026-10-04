// Error handling. Express 5 forwards errors thrown in async handlers to here
// automatically, so controllers don't need try/catch wrappers.

/**
 * Catch-all for unmatched routes. Mount after all routers.
 * Responds 404 with `{ error: 'Not found' }`.
 */
function notFound(req, res, next) {
  throw new Error('Not implemented');
}

/**
 * Central error handler. Mount last.
 * - Map known errors to status codes, e.g. Prisma P2002 (unique constraint,
 *   like a taken username or duplicate reaction) → 409, P2025 (record not
 *   found) → 404, P2003 (foreign key / Restrict violation) → 409.
 * - Use `err.status` if a service set one (e.g. 403 for editing someone
 *   else's post).
 * - Everything else → 500, without leaking stack traces outside development.
 */
function errorHandler(err, req, res, next) {
  throw new Error('Not implemented');
}

export { notFound, errorHandler };
