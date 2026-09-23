# TODO

## Draft UI Designs:
- [ ] Landing/Login Page
- [ ] Navbar
- [ ] Pinterest Style x Tinder Feed
- [ ] Profile Page

## Documentation
- [ ] Update inspiration section on README.md
 
## Modular Posts
- [ ] Frontend
  - [ ] Checklist UI
  - [ ] Video module UI
  - [ ] Timer module UI
  - [ ] Image module UI
  - [ ] Text module UI
  - [ ] Location module UI
  - [ ] Rating module UI
- [ ] Backend
  - [ ] Checklist module (schema + API)
  - [ ] Video module (schema + API)
  - [ ] Timer module (schema + API)
  - [ ] Image module (schema + API)
  - [ ] Text module (schema + API)
  - [ ] Location module (schema + API)
  - [ ] Rating module (schema + API)
  

## Feed
- [ ] Default feed
  - [ ] Engagement-weighted scoring (likes / comments / saves / follows-from-post)
  - [ ] Feed endpoint + pagination
- [ ] Proximity feed
  - [ ] Recency filter
  - [ ] Haversine distance filter
  - [ ] Popularity sort
  - [ ] Browser geolocation permission flow
  
## Accounts & Auth
- [ ] Decide auth provider (Better Auth vs Supabase Auth)
- [ ] Sign up / login
- [ ] Session handling

## Moderation
- [ ] Report/flag post action
- [ ] Moderation queue (admin dashboard)
- [ ] Moderation action logging

## Infrastructure
- [x] Draft initial Prisma schema (User, Post, PostModule, Comment, Reaction)
- [ ] Provision Supabase Postgres instance + wire `DATABASE_URL`
- [ ] Install Prisma Client + run initial migration
- [ ] Hosting/deployment (TBD)
- [x] Repo setup (Git/GitHub org)
- [x] VITE + React frontend skeleton
- [x] Node.js + Express backend skeleton

## Core API — Users, Posts, Comments, Reactions
_(tracks backend functionality against the models already defined in `backend/prisma/schema.prisma`; none of this is implemented yet — `server.js` is still empty)_
- [ ] User
  - [ ] Create (signup, tied to Accounts & Auth below)
  - [ ] Read profile
  - [ ] Update profile (`username`, `description`)
  - _Delete is post-MVP — see [Post-MVP](#post-mvp) below._
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
  - [ ] Delete/toggle (+ decrement matching counter transactionally)
- [ ] Cross-cutting
  - [ ] Shared counter-sync helper functions (take a Prisma `tx` client so they compose into larger transactions)

## Post-MVP
- [ ] Account deletion — hard delete, no soft deletion. Until built, the schema's `Restrict` rules block any user delete. See README Architecture Notes.
  - [ ] User-deletion orchestration function, in one `prisma.$transaction`: delete the user's posts (cascade clears their modules/comments/reactions) → decrement `commentCount` for the user's comments on others' posts, then delete them → decrement counts for the user's reactions on others' posts/comments, then delete them (incl. follows) → delete the user (follows *of* them cascade)
  - [ ] After commit: delete the auth provider account and the user's Cloudinary images (idempotent/retry-safe)
  - [ ] Confirmation step in the UI (deletion is permanent)

## Polish (MDP-stage) -- make fancier
- [ ] UI animation pass (composer + feed)
- [ ] UI color theming
- [ ] Load time optimization
