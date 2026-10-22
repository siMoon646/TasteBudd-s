# Architecture

How TasteBudd's is put together and the rules the code has to follow. For what each table and column means, see [DATA_DICTIONARY.md](DATA_DICTIONARY.md).

## Contents

- [Request paths](#request-paths)
- [Backend layout](#backend-layout)
  - [Auth middleware](#auth-middleware)
  - [Error handling](#error-handling)
- [Frontend layout](#frontend-layout)
- [Data integrity rules](#data-integrity-rules)
- [Real-time (Supabase Realtime)](#real-time-supabase-realtime)

---

## Request paths

- **Reads, writes & business logic** (e.g. constructing a modular post, loading a feed) go through the Node backend via Prisma. Permission checks live in one place: the backend's service layer.
- **Real-time subscriptions** (e.g. live comment updates) go directly from the frontend to Supabase Realtime. See [Real-time](#real-time-supabase-realtime) below.
- **Auth** is Supabase Auth. The frontend signs in with supabase-js (the shared client in `frontend/src/supabase.js`) and sends its access token to the backend as `Authorization: Bearer <jwt>`. The backend verifies it on each request (see [Auth middleware](#auth-middleware)). `User.id` is set to the Supabase auth user id at signup.

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
| `lib/` | Shared setup. `lib/db.js` creates the single Prisma Client (through the `@prisma/adapter-pg` driver adapter and a `pg` connection pool on `DATABASE_URL`) and exports it. Services import this instance; nothing else calls `new PrismaClient()`, so the whole backend shares one pool. `lib/supabase.js` creates the single server-side Supabase client from `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` (it throws at startup if either is missing). It is only used to verify access tokens, so session storage and auto-refresh are off. `lib/httpError.js` default-exports `httpError(status, message)`, which builds an `Error` with `status` set; services throw it and `errorHandler` sends that status. |
| `routes/` | Maps URLs + HTTP methods to controller functions and attaches middleware. `routes/index.js` combines the resource routers; `server.js` mounts it under `/api`. |
| `controllers/` | HTTP only: reads params/body/`req.user`, calls a service, sends the response and status code. |
| `services/` | Business rules and all Prisma access: validation, permission checks, transactions, counter updates. |
| `middleware/` | Cross-cutting request handling: auth (`requireAuth` / `optionalAuth`), validation, 404 and error handling. |

The backend runs as ES modules (`"type": "module"` in `backend/package.json`). Every file uses `import`/`export`, and relative imports include the file extension (`'../middleware/auth.js'`). Routers are default exports; controllers, services, and middleware use named exports. The middleware is implemented, and so are the user routes (`routes/userRoutes.js`: signup, profile read/update, follow/unfollow). The post, comment, and feed routes, and post/comment reactions, are still stubs that throw `Not implemented`. `server.js` also keeps a test route, `GET /api/users`, that lists every user.

`server.js` sets things up in this order: `express.json()` → the test route → `routes/index.js` under `/api` → `notFound` → `errorHandler`.

### Auth middleware

`middleware/auth.js` exports two functions that routes attach as needed:

- **`requireAuth`** reads the Bearer token, verifies it, and sets `req.user = { id, email, username }`. It responds `401` if the token is missing, invalid, or expired.
- **`optionalAuth`** does the same when a valid token is present and otherwise continues without `req.user`. It's for public reads that show extra info to signed-in users (e.g. whether the viewer liked a post).

How it works:

- Tokens are verified with `supabase.auth.getClaims()`, which checks the JWT signature locally against the project's public keys (fetched once, then cached) instead of calling Supabase on every request. **Tradeoff:** a token stays valid until it expires (1 hour), even after the user signs out.
- `req.user.id` is the token's `sub` (the Supabase auth user id). `username` is looked up from the `users` table and is `null` until the profile row exists. That's the normal state during signup, between the Supabase sign-up and `POST /api/users`.
- If Supabase can't be reached (e.g. fetching the public keys fails), the middleware throws a `503` instead of a `401`, so an outage isn't reported to the client as "you're signed out".

### Error handling

`middleware/errorHandler.js` exports `notFound` (any unmatched route → `404 { error: 'Not found' }`) and `errorHandler`. Express 5 forwards errors thrown in async handlers to `errorHandler` automatically, so controllers don't need try/catch. `errorHandler` picks the status in this order:

1. Known Prisma errors: `P2002` (unique constraint) → `409`, `P2003` (foreign key / `Restrict`) → `409`, `P2025` (record not found) → `404`.
2. `err.status` / `err.statusCode`, set by a service via `httpError(status, message)` from `lib/httpError.js` (e.g. `400`, `404`) or by `express.json()` (`400` on malformed JSON).

Services let these Prisma errors pass through by default and only catch one when it needs a different meaning. For example, `followUser` turns `P2003` into a `404` (target user doesn't exist) and treats `P2002` (already following) as success.
3. Otherwise `500`.

Responses are `{ error: message }`. Errors with status 500 or higher are logged. In production their message is replaced with `Internal server error`; outside production the stack trace is included.

---

## Frontend layout

Code in `frontend/src/`:

| Path | Responsibility |
|---|---|
| `main.jsx` | Entry point. Renders `App` and imports `index.css`. |
| `App.jsx` | Route table (React Router `BrowserRouter`). Each route renders one page. |
| `pages/` | One component per screen. |
| `components/` | Reusable pieces shared by pages (`Post.jsx` so far). |
| `supabase.js` | Creates and exports the single Supabase client (`supabase`), built from `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Used for auth now and Realtime later; nothing else calls `createClient`. |
| `index.css` | `@import "tailwindcss";` only. Styling is Tailwind utility classes (v4, loaded by the `@tailwindcss/vite` plugin in `vite.config.js`). |

| Route | Page | State |
|---|---|---|
| `/` | `pages/landing.jsx` | Header with Login/Signup links and hardcoded placeholder posts |
| `/login` | `pages/login.jsx` | Heading only |
| `/signup` | `pages/signup.jsx` | Heading only |
| `/homepage` | `pages/homepage.jsx` | Draft search bar and nav buttons |
| `/auth` | `pages/AuthTest.jsx` | Temporary dev-only panel: sign up, sign in, set password, sign out, and call `POST /api/users` with or without the access token. Delete once the real login page exists. |

`pages/profile.jsx` is an empty file with no route. `AuthTest.jsx` is the only page that uses the Supabase client or calls the backend so far, and no route is protected.

In development, the Vite dev server proxies `/api` to the backend at `http://localhost:3000` (`server.proxy` in `vite.config.js`). The frontend can call `fetch('/api/...')` with no CORS setup.

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

### Example (frontend) (?)

```js
import { supabase } from '../supabase.js';

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
- The frontend connects with the project's public **publishable key** (`VITE_SUPABASE_PUBLISHABLE_KEY`, the newer name for the anon key) plus the signed-in user's Supabase Auth session. Never ship the service role key to the browser.

### Gotchas

- Payloads use the **database column names** (`snake_case`, e.g. `like_count`), not Prisma's `camelCase` field names.
- **`DELETE` events can't be filtered** and only carry the deleted row's id, so "comment removed" is easiest to handle by refetching the comment list.
- Each open subscription is a connection counted against the Supabase plan's Realtime limits, so subscribe per open post and always unsubscribe on close.
- Realtime is best-effort: if the socket drops, events during the gap are lost. Refetch from the API when the channel reconnects.
