// PostModule helpers. `PostModule.data` is JSON whose shape depends on
// `moduleType`; the DB doesn't enforce it, so it's validated here before any
// write. Shapes (from schema.prisma / docs/DATA_DICTIONARY.md):
//
//   text:           { body: string }
//   checklist:      { items: [{ id, text, checked }] }
//   numbered_list:  { items: [{ id, text }] }
//   video:          { video_id: string }                  // YouTube only
//   location:       { address?, longitude, latitude, label }
//   timer:          { hours: 0-99, minutes: 0-59, label? }
//   body_image:     { url: string, alt? }                 // Cloudinary

/**
 * Validates one module's `data` against the shape for its `moduleType`.
 * Returns the parsed data, or throws a 400-status error describing what's wrong.
 */
function validateModuleData(moduleType, data) {
  throw new Error('Not implemented');
}

/**
 * Validates a full module list for create/update and prepares it for Prisma.
 * - Run validateModuleData on each entry.
 * - Reject duplicate positions (would violate @@unique([postId, position])).
 * - If positions are omitted, assign them from array order (1, 2, 3, ...).
 * Returns `[{ moduleType, position, data }]` ready for a nested create.
 */
function prepareModules(modules) {
  throw new Error('Not implemented');
}

export { validateModuleData, prepareModules };
