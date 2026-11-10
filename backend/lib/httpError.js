// Shared helper for services: throw an error with an HTTP status attached.
// errorHandler (middleware/errorHandler.js) reads `err.status` to pick the
// response code, so services can stay HTTP-agnostic otherwise.

/** Builds an error that errorHandler turns into this HTTP status. */
function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export default httpError;
