// Request validation. The schema comments call for Zod at the app layer
// (not installed yet).

/**
 * Returns middleware that validates part of the request against a schema.
 * - `source` is which part to check: 'body', 'params', or 'query'.
 * - On success, replace `req[source]` with the parsed (typed/cleaned) value.
 * - On failure, respond 400 with the validation errors.
 *
 * Usage: router.post('/', validate(createPostSchema), createPost)
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    throw new Error('Not implemented');
  };
}

module.exports = { validate };
