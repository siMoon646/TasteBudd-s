# Project Board

Progress log, newest first.

---

# 10/04/2026

## Backend connected to the database
- Added `backend/lib/db.js`, the one shared Prisma Client (Prisma 7 driver adapter `@prisma/adapter-pg` over a `pg` pool on `DATABASE_URL`).
- `server.js` now has a working test route, `GET /api/users`, which confirms the database connection.
- Converted every backend stub from CommonJS to ES modules and mounted `routes/index.js` under `/api`. The handlers are still stubs.
- `npm run dev` from the repo root now starts the backend and the frontend together (`concurrently`).

## Frontend: routing and pages
- Added React Router. `App.jsx` now routes `/` (landing), `/login`, `/signup`, and `/homepage`.
- New `pages/landing.jsx`: header with Login and Signup links, plus three placeholder posts rendered through a new `components/Post.jsx`.
- `pages/login.jsx` and new `pages/signup.jsx` show a heading only. `pages/homepage.jsx` is now a real component.

## Auth: Supabase client
- Added `frontend/src/supabase.js`, the shared Supabase client for auth. No page uses it yet.
- Turned on "Confirm email" in the Supabase dashboard. Custom SMTP is still to do, so confirmation emails only reach project team members for now.

## Styling: Tailwind CSS
Installed Tailwind v4 through the `@tailwindcss/vite` plugin and replaced the Vite starter styles in `index.css` with the Tailwind import. No page uses utility classes yet.

## Docs
- README: added an Inspirations section (Tinder, Twitter, Pinterest, Instagram), frontend notes, and the updated tech stack and status.
- Architecture: added a Frontend layout section.
- TODO: added and ticked off the Supabase client, routing, and Tailwind items.

---

# 10/02/2026

## Database live on Supabase
The Supabase Postgres database is provisioned and the initial migration (`20261003001153_init`) is applied, so every table in `schema.prisma` now exists in the shared database. `backend/.env.example` and `frontend/.env.example` list the variables each side needs.

## Supabase client
Installed `@supabase/supabase-js` in both `backend/` and `frontend/`, ready for the auth work.

## Frontend: first pages
- Removed the Vite starter content from `App.jsx`; it now renders the login page.
- Added `pages/homepage.jsx`, a markup draft with a search bar and nav buttons (Homepage, Messages, Notifications, Saved, Settings). It isn't a React component yet and isn't rendered anywhere.
- Added empty `pages/login.jsx` and `pages/profile.jsx` files to fill in next.

## Docs
- README setup now covers env files, migrations, and Prisma 7 notes.
- TODO: marked the database and migration items done, added a Prisma Client setup item (Prisma 7 needs a driver adapter) and a Gmail SMTP item for Supabase Auth emails.
- Data dictionary: reworded the like/dislike rule to state what the app must prevent.

---

# 09/30/2026

## Modular post schema — done
Follow-up to the 09/10 WIP entry. The initial Prisma schema (User, Post, PostModule, Comment, Reaction) landed on 09/12 and was refined through 09/24: indexes, timestamps, and the counter/delete rules. Soft deletion was tried and then dropped in favor of hard deletes (post-MVP). A new `body_image` module type was added for inline images.

## Docs
- Added a data dictionary (09/23) covering every table, column, and app-enforced rule.
- Reorganized docs into `docs/`: architecture notes moved out of the README into `ARCHITECTURE.md`, and the README now has setup instructions.

## Decisions
- **Auth:** Supabase Auth. `User.id` matches the Supabase auth user id.
- **Data access:** all reads and writes go through Express + Prisma. Supabase Realtime is only used for live updates (comments, reaction counts).
- **MVP scope:** location-tagged posts, the proximity feed, and the rating module are deferred to post-MVP.

## Backend scaffold
Stubbed routes, controllers, services, and middleware for the core API (users, posts, comments, reactions, default feed). Signatures and comments only; no logic yet, and `server.js` isn't wired up.

## Team meeting (09/12/2026)

---

# 09/10/2026

## API/tool scouting
Researching APIs and tools that could support development going forward. Nothing has been finalized yet, but the goal is to avoid building things from scratch when a solid existing option is available.

## Team meeting scheduled for 09/12/2026
Coordinated with the rest of the team and confirmed a time to meet and go over project details. Meeting is officially scheduled. Will post a follow-up log after it happens with notes and any decisions made.

## Brand image / colors — TBD
Soon to start the process of defining the project's visual identity, beginning with color selection. This is being handled as a group decision, since it affects how the whole project looks and feels. Rough UI sketches are also planned around the same time so the color choices can be evaluated.

## Modular post schema draft — WIP
Currently working on the schema for one of the project's core features. This part is being handled individually, so progress is steady but slower than a team effort would allow. Will update this log once the schema is in a usable state.
