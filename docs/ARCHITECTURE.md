# Architecture

How TasteBudd's is put together and the rules the code has to follow. For what each table and column means, see [DATA_DICTIONARY.md](DATA_DICTIONARY.md).

## Contents

- [Request paths](#request-paths)
- [Backend layout](#backend-layout)
- [Data integrity rules](#data-integrity-rules)
- [Real-time (Supabase Realtime)](#real-time-supabase-realtime)

---

## Request paths

- **Reads, writes & business logic** (e.g. constructing a modular post, loading a feed) go through the Node backend via Prisma. Permission checks live in one place: the backend's service layer.
- **Real-time subscriptions** (e.g. live comment updates) go directly from the frontend to Supabase Realtime. See [Real-time](#real-time-supabase-realtime) below.
- **Auth** is Supabase Auth. The frontend signs in with supabase-js and sends its access token to the backend, which verifies it on each request. `User.id` is set to the Supabase auth user id at signup.

```
Browser ──HTTP (Bearer token)──> Express ──Prisma──> Postgres (Supabase)
   ▲                                                      │
   └──────────── WebSocket (Supabase Realtime) ◄──────────┘
```

---

## Backend layout

Code in `backend/` is split by responsibility:

| Folder | Responsibility |
|---|---|
| `lib/` | Shared setup. `lib/db.js` creates the single Prisma Client (through the `@prisma/adapter-pg` driver adapter and a `pg` connection pool on `DATABASE_URL`) and exports it. Services import this instance; nothing else calls `new PrismaClient()`, so the whole backend shares one pool. |
| `routes/` | Maps URLs + HTTP methods to controller functions and attaches middleware. `routes/index.js` combines the resource routers; `server.js` mounts it under `/api`. |
| `controllers/` | HTTP only: reads params/body/`req.user`, calls a service, sends the response and status code. |
| `services/` | Business rules and all Prisma access: validation, permission checks, transactions, counter updates. |
| `middleware/` | Cross-cutting request handling: auth (`requireAuth` / `optionalAuth`), validation, 404 and error handling. |

The backend runs as ES modules (`"type": "module"` in `backend/package.json`). Every file uses `import`/`export`, and relative imports include the file extension (`'../middleware/auth.js'`). Routers are default exports; controllers, services, and middleware use named exports. The handlers behind the mounted routes are still stubs that throw `Not implemented`; the only working route is a test one in `server.js`, `GET /api/users`.

---

## Data integrity rules

- **Denormalized counters must stay in sync with their source rows.** `Post.likeCount`/`dislikeCount`/`saveCount`/`commentCount` and `Comment.likeCount`/`dislikeCount` are caches, not sources of truth — the `Reaction` and `Comment` tables are. Every code path that creates or deletes a `Reaction` (or a `Comment`, for `commentCount`) must update the matching counter in the same `prisma.$transaction`, so the two can never partially apply. Skipping this on any write path — including future ones — lets the cached count silently drift from reality. The shared helpers for this live in `backend/services/counterService.js`.

- **Cascading deletes (`onDelete: Cascade` in the schema) are only for structural cleanup that touches no denormalized counters** — e.g. a `Post`'s own `PostModule`s, or a `Post`'s comments/reactions when the post itself is being deleted (the whole subtree disappears together, counters included, so there's nothing left to drift). Any delete that crosses into *other* rows' denormalized counts — e.g. removing a user's `Reaction` on someone else's `Post`, or a `Comment` they left on someone else's `Post` — must go through server logic instead, so the counter decrement and the row delete happen together (see the counters rule above). Relations that would need this are deliberately left without `onDelete: Cascade` (defaulting to `Restrict`), so the DB blocks an unsafe delete rather than silently leaving counters wrong.

- **Users are hard-deleted, never soft-deleted.** Account deletion isn't built yet. When it is, deleting a user will be a single server function that removes their posts, comments, and reactions with the counter decrements above, all in one transaction (step order in [TODO.md](TODO.md)). Until then, the `Restrict` rules on every relation from a user's content make the DB refuse any user delete.

---

## Real-time (Supabase Realtime)

Supabase Realtime watches Postgres for row changes (inserts, updates, deletes) and pushes them to subscribed browsers over a WebSocket. We use it instead of sockets on Express because the backend is planned to run serverless (leaning Vercel), where long-lived connections aren't practical.

**Realtime only notifies — it never writes.** All writes still go through Express → Prisma. Realtime just tells open pages that something changed.

### How a live update flows

1. A user comments on a post → `POST /api/posts/:postId/comments` → Express inserts the comment and bumps `posts.comment_count` in one transaction.
2. Once the transaction commits, Postgres reports both row changes to Supabase Realtime.
3. Realtime pushes them to every browser subscribed to that post.
4. Each browser updates its UI — either straight from the event payload, or by refetching from the API (see below).

### What's live

| Screen | Table / event | Filter | What the client does |
|---|---|---|---|
| Open post: like/dislike/save/comment counts | `posts` `UPDATE` | `id=eq.<postId>` | Read the new `*_count` values straight from the payload. Because the counters are updated in the same transaction as the reaction/comment (see [counters rule](#data-integrity-rules)), one subscription covers every count. |
| Open post: new comments | `comments` `INSERT` | `post_id=eq.<postId>` | Refetch the comment list (or that comment) from the API — the payload is the raw row and doesn't include the author's username. |

Feed and notification updates are not live; there is no notifications table yet.

### Example (frontend)

```js
const channel = supabase
  .channel(`post-${postId}`)
  .on('postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'posts', filter: `id=eq.${postId}` },
      ({ new: row }) => setCounts({ likes: row.like_count, comments: row.comment_count }))
  .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
      () => refetchComments())
  .subscribe();

// When the post closes / component unmounts:
supabase.removeChannel(channel);
```

### Setup required in Supabase

- **Turn on Realtime for each watched table** by adding it to the `supabase_realtime` publication (Dashboard → Database → Publications, or `alter publication supabase_realtime add table posts, comments;`). Tables not in the publication send no events.
- **Enable Row Level Security with `SELECT` policies** on those tables. Realtime only sends a change to a user who could read that row under RLS. Prisma connects as the database owner and ignores RLS, so these policies only affect the browser (Realtime) — the backend's permission checks are still the real ones.
- The frontend connects with the project's public **anon key** plus the signed-in user's Supabase Auth session. Never ship the service role key to the browser.

### Gotchas

- Payloads use the **database column names** (`snake_case`, e.g. `like_count`), not Prisma's `camelCase` field names.
- **`DELETE` events can't be filtered** and only carry the deleted row's id, so "comment removed" is easiest to handle by refetching the comment list.
- Each open subscription is a connection counted against the Supabase plan's Realtime limits, so subscribe per open post and always unsubscribe on close.
- Realtime is best-effort: if the socket drops, events during the gap are lost. Refetch from the API when the channel reconnects.
