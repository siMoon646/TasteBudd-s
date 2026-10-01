# Project Board

Progress log, newest first.

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

## Team meeting (09/12/2026) — notes TBD
_Add notes and decisions from the 09/12 meeting here._

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
