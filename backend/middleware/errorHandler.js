// Error handling. Express 5 forwards errors thrown in async handlers to here
// automatically, so controllers don't need try/catch wrappers.

// Prisma error codes we expect from normal use, mapped to an HTTP status
// and a message that's safe to show the client.
const PRISMA_ERRORS = {
  P2002: { status: 409, message: 'Already exists' }, // unique constraint (taken username, duplicate reaction)
  P2003: { status: 409, message: 'Related records prevent this action' }, // foreign key / Restrict violation
  P2025: { status: 404, message: 'Not found' }, // record to update/delete doesn't exist
};

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Catch-all for unmatched routes. Mount after all routers.
 * Responds 404 with `{ error: 'Not found' }`.
 */
function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
}

/**
 * Central error handler. Mount last.
 * - Known Prisma errors → mapped status (see PRISMA_ERRORS).
 * - `err.status` if a service set one (e.g. 403 for editing someone else's post).
 *   express.json() also sets 400 on malformed JSON this way.
 * - Everything else → 500, without leaking details outside development.
 */
function errorHandler(err, req, res, next) {
  // If a response already started streaming, let Express close the connection.
  if (res.headersSent) return next(err);

  const prismaError = PRISMA_ERRORS[err.code];
  const status = prismaError?.status ?? err.status ?? err.statusCode ?? 500;
  let message = prismaError?.message ?? err.message;

  if (status >= 500) {
    console.error(err); // server bugs get logged; client errors don't
    if (isProduction) message = 'Internal server error';
  }

  res.status(status).json({
    error: message,
    // Stack traces only in development, and only for server errors
    ...(!isProduction && status >= 500 && { stack: err.stack }),
  });
}

export { notFound, errorHandler };