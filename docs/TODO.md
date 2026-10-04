# TODO

Organized by stage: [MVP](#mvp) → [Post-MVP](#post-mvp) → [MDP](#mdp--polish).

---

## MVP

### Draft UI Designs
- [ ] Landing/Login/Signup Pages (`frontend/src/pages/landing.jsx` has a header with Login/Signup links and placeholder posts; `login.jsx` and `signup.jsx` are routed but only show a heading)
- [ ] Navbar (draft buttons + search bar in `frontend/src/pages/homepage.jsx`, routed at `/homepage`: Homepage, Messages, Notifications, Saved, Settings)
- [ ] Pinterest Style x Tinder Feed
- [ ] Profile Page (`frontend/src/pages/profile.jsx` created, still empty, no route yet)

### Documentation
- [x] Update inspiration section on README.md
- [x] Setup instructions in README.md (update as Prisma/Supabase get wired up)

### Modular Posts
- [ ] Frontend
  - [ ] Text module UI
  - [ ] Checklist module UI
  - [ ] Numbered list module UI
  - [ ] Video module UI
  - [ ] Timer module UI
  - [ ] Body image module UI
- [ ] Backend
  - [ ] Text module (schema + API)
  - [ ] Checklist module (schema + API)
  - [ ] Numbered list module (schema + API)
  - [ ] Video module (schema + API)
  - [ ] Timer module (schema + API)
  - [ ] Body image module (`body_image` — schema + API)

### Feed
- [ ] Default feed
  - [ ] Engagement-weighted scoring (likes / comments / saves / follows-from-post)
  - [ ] Feed endpoint + pagination

### Accounts & Auth
- [x] Decide auth provider — Supabase Auth
- [x] Set up `frontend/src/supabase.js` for auth (exports one shared `supabase` client via `createClient`, using `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` from `frontend/.env`)
- [ ] Sign up / login (frontend `supabase.auth` → then `POST /api/users` to create the profile row, `User.id` = Supabase auth user id)
- [ ] Session handling (supabase-js manages/refreshes the session on the frontend; backend verifies the access token on each request in `requireAuth`)
- [ ] Custom SMTP via Gmail for Supabase Auth emails (Supabase's built-in email service is heavily rate-limited, roughly 2 emails/hour, and only sends to project team members' addresses, so real signups can't get confirmation emails). Needs a Gmail App Password (requires 2FA on the account), entered in Supabase → Authentication → SMTP Settings
- [x] Turn on "Confirm email" in the Supabase dashboard (Authentication → Sign In / Providers → Email). Without it, users can sign up with email addresses they don't own. Depends on the custom SMTP task above, since confirmation emails won't reach real signups otherwise

### Moderation
- [ ] Report/flag post action
- [ ] Moderation queue (admin dashboard)
- [ ] Moderation action logging

### Infrastructure
- [x] Draft initial Prisma schema (User, Post, PostModule, Comment, Reaction)
- [x] Provision Supabase Postgres instance + wire `DATABASE_URL` / `DIRECT_URL`
- [x] Install Prisma Client + run initial migration (Prisma 7)
- [x] Create the shared Prisma Client instance for the backend (Prisma 7 needs a driver adapter, e.g. `@prisma/adapter-pg`, pointed at `DATABASE_URL`)
- [ ] Hosting/deployment (TBD)
- [x] Repo setup (Git/GitHub org)
- [x] VITE + React frontend skeleton
- [x] Client-side routing with React Router (`/`, `/login`, `/signup`, `/homepage` in `frontend/src/App.jsx`)
- [x] Tailwind CSS v4 setup (`@tailwindcss/vite` plugin; no page uses utility classes yet)
- [x] Run backend + frontend together from the repo root (`npm run dev`, via `concurrently`)
- [x] Node.js + Express backend skeleton

### Core API — Users, Posts, Comments, Reactions
_(tracks backend functionality against the models already defined in `backend/prisma/schema.prisma`; function signatures are stubbed in `backend/routes`, `controllers`, `services`, and `middleware`, but none of this is implemented yet — `server.js` mounts the stubs under `/api`, and its only working route is a test one, `GET /api/users`)_
- [ ] User
  - [ ] Create (signup, tied to Accounts & Auth above)
  - [ ] Read profile
  - [ ] Update profile (`username`, `description`)
- [ ] Post
  - [ ] Create (caption/images + attached `PostModule[]`)
  - [ ] Read (single post + list/feed queries)
  - [ ] Update (caption/images/modules)
  - [ ] Delete (relies on schema-level `onDelete: Cascade` for modules/comments/reactions)
- [ ] Comment
  - [ ] Create (+ increment `Post.commentCount` in the same transaction)
  - [ ] Read (by post)
  - [ ] Delete (+ decrement `Post.commentCount` in the same transaction)
- [ ] Reaction
  - [ ] Create — like/dislike/save on a post or comment (+ increment matching counter transactionally)
  - [ ] Create — follow on a user
  - [ ] Delete (+ decrement matching counter transactionally) — add/remove are idempotent `PUT`/`DELETE`, not a toggle
- [ ] Cross-cutting
  - [x] Convert the stubs from CommonJS (`require`/`module.exports`) to ES modules (the backend is now `"type": "module"`), then mount `routes/index.js` under `/api` in `server.js`
  - [ ] Add `express.json()` to `server.js`, before the `/api` routes (POST/PATCH handlers can't read a request body without it)
  - [ ] Implement `notFound` and `errorHandler` (both are still stubs in `backend/middleware/errorHandler.js`)
  - [ ] Mount `notFound` and `errorHandler` in `server.js`, after the `/api` routes (`notFound` first, `errorHandler` last)
  - [ ] Shared counter-sync helper functions (take a Prisma `tx` client so they compose into larger transactions)

---

## Post-MVP

### Account deletion
Hard delete, no soft deletion. Until built, the schema's `Restrict` rules block any user delete. See [ARCHITECTURE.md → Data integrity rules](ARCHITECTURE.md#data-integrity-rules).
- [ ] User-deletion orchestration function, in one `prisma.$transaction`: delete the user's posts (cascade clears their modules/comments/reactions) → decrement `commentCount` for the user's comments on others' posts, then delete them → decrement counts for the user's reactions on others' posts/comments, then delete them (incl. follows) → delete the user (follows *of* them cascade)
- [ ] After commit: delete the Supabase Auth user (`auth.admin.deleteUser`, needs the service role key) and the user's Cloudinary images (idempotent/retry-safe)
- [ ] Confirmation step in the UI (deletion is permanent)

### Location-tagged posts
- [ ] Location module UI
- [ ] Location module (schema + API) — needs a new `ModuleType` value. Shape: `{ address?, longitude, latitude, label }`

### Proximity feed
- [ ] Recency filter
- [ ] Haversine distance filter
- [ ] Popularity sort
- [ ] Browser geolocation permission flow

### Rating module
- [ ] Rating module UI
- [ ] Rating module (schema + API) — needs a new `ModuleType` value

---

## MDP — Polish
_(MDP = minimum delightful product: the polish pass after the MVP works — make fancier)_
- [ ] UI animation pass (composer + feed)
- [ ] UI color theming
- [ ] Load time optimization
