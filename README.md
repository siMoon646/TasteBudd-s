# TasteBudd's

A social media platform centered around food.

TasteBudd's is built on the idea that food content deserves a different kind of post than a typical social feed offers. Where conventional platforms treat every post as a photo-and-caption, TasteBudd's introduces **modular posts**: build a single post out of interchangeable pieces — a checklist for ingredients or steps, an embedded video for a follow-along tutorial, a timer for tracking cook time, and more — so a post can actually match how people cook and eat, not just how they scroll.

Posts can also carry an optional location tag, powering a dedicated **location-based feed**: using your device's location, browse posts pinned nearby within a range you control.

## Inspirations:
- TBD...

## Features

- **Modular Posts** — build a post from interchangeable blocks:
    - **Text** — freeform body content
    - **Checklist** — ingredient lists or step tracking
    - **Numbered List** — ordered steps
    - **Video Embed** — YouTube-based follow-along tutorials
    - **Location Tag** — pin a post to a place
    - **Timer** — track cook/prep time
- **Location-Based Feed** — a dedicated tab surfacing nearby posts, with a user-adjustable search radius

## Tech Stack

**Backend**
- Node.js
- Express (web framework)

**Database**
- Supabase (hosted Postgres)
- Prisma (ORM for backend writes & business logic)
- PostgreSQL

**Frontend**
- Vite + React
- Tailwind CSS

**Auth**
- Supabase Auth

**Real-time**
- Supabase Realtime (Postgres change subscriptions for live feeds, comments, and notifications)

**Media**
- Cloudinary (image storage & serving)

**Deployment**
- Vercel or Railway (leaning Vercel — serverless-friendly and cost-effective, since real-time is offloaded to Supabase rather than held open on the backend)

## Architecture Notes

- **Data dictionary:** see [DATA_DICTIONARY.md](DATA_DICTIONARY.md) for every table, column, enum, and constraint in the schema, plus the rules the app enforces that the database does not.

- **Writes & business logic** (e.g. constructing a modular post) go through the Node backend via Prisma.

- **Reads & real-time subscriptions** (e.g. live comment updates) go directly from the frontend to Supabase.

- **Denormalized counters must stay in sync with their source rows.** `Post.likeCount`/`dislikeCount`/`saveCount`/`commentCount` and `Comment.likeCount`/`dislikeCount` are caches, not sources of truth — the `Reaction` and `Comment` tables are. Every code path that creates or deletes a `Reaction` (or a `Comment`, for `commentCount`) must update the matching counter in the same `prisma.$transaction`, so the two can never partially apply. Skipping this on any write path — including future ones — lets the cached count silently drift from reality.

- **Cascading deletes (`onDelete: Cascade` in the schema) are only for structural cleanup that touches no denormalized counters** — e.g. a `Post`'s own `PostModule`s, or a `Post`'s comments/reactions when the post itself is being deleted (the whole subtree disappears together, counters included, so there's nothing left to drift). Any delete that crosses into *other* rows' denormalized counts — e.g. removing a user's `Reaction` on someone else's `Post`, or a `Comment` they left on someone else's `Post` — must go through server logic instead, so the counter decrement and the row delete happen together (see the counters rule above). Relations that would need this are deliberately left without `onDelete: Cascade` (defaulting to `Restrict`), so the DB blocks an unsafe delete rather than silently leaving counters wrong.

- **Users are hard-deleted, never soft-deleted — and account deletion is post-MVP.** When built, deleting a user will be a single server function that removes their posts, comments, and reactions with the counter decrements above, all in one transaction (steps in TODO.md → Post-MVP). Until then, the `Restrict` rules on every relation from a user's content make the DB refuse any user delete.

## Status

Early scaffold — backend is a bare Node/Express server, frontend is a stock Vite + React setup. Nothing is wired together yet. Bones so bare fr.

## Contributors

- Simon Tang
- Vanna Feng
- Emily Li
