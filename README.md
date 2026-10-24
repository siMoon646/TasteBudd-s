# TasteBudd's

A social media platform centered around food.

TasteBudd's is built on the idea that food content deserves a different kind of post than a typical social feed offers. Where conventional platforms treat every post as a photo-and-caption, TasteBudd's introduces **modular posts**: build a single post out of interchangeable pieces — a checklist for ingredients or steps, an embedded video for a follow-along tutorial, a timer for tracking cook time, and more — so a post can actually match how people cook and eat, not just how they scroll.

Later on (post-MVP), posts will also be able to carry an optional location tag, powering a dedicated **location-based feed**: using your device's location, browse posts pinned nearby within a range you control.

## Inspirations
- Tinder
- Twitter
- Pinterest
- Instagram

## Features

- **Swiping Page** - swipe on users based on food interest
    - **User's Information** - the face behind the (food) post
    - **What Food?** - seek out your flavors/desires
    - **How To Use** - like Tinder, swipe left for 'no' or swipe right for 'yes'
- **Modular Posts** — build a post from interchangeable blocks:
    - **Text** — freeform body content
    - **Checklist** — ingredient lists or step tracking
    - **Numbered List** — ordered steps
    - **Video Embed** — YouTube-based follow-along tutorials
    - **Timer** — track cook/prep time
    - **Body Image** — an image placed between other blocks
- **Planned (post-MVP)**
    - **Location Tag** module — pin a post to a place
    - **Location-Based Feed** — a dedicated tab surfacing nearby posts, with a user-adjustable search radius
    - **Rating** module
    - **Moderation** — report/flag posts, an admin moderation queue, and logging of moderation actions

## Tech Stack

**Backend**
- Node.js
- Express (web framework)

**Database**
- Supabase (hosted Postgres)
- Prisma 7 (ORM for all backend reads, writes & business logic)
- PostgreSQL

**Frontend**
- Vite + React
- React Router (`react-router-dom`, client-side routing)
- Tailwind CSS v4 (through the `@tailwindcss/vite` plugin)

**Auth**
- Supabase Auth

**Real-time**
- Supabase Realtime (Postgres change subscriptions for live comments and reaction counts — see [Architecture → Real-time](docs/ARCHITECTURE.md#real-time-supabase-realtime))

**Media**
- Cloudinary (image storage & serving)

**Deployment**
- Vercel or Railway (leaning Vercel — serverless-friendly and cost-effective, since real-time is offloaded to Supabase rather than held open on the backend)

## Architecture

The Express backend handles all reads, writes, and business logic through Prisma. Supabase Realtime pushes live updates (comments, reaction counts) straight to the browser, and Supabase Auth handles sign-in.

## Setup

**Prerequisites:** Node.js (developed on v24) and npm, plus Git.

```bash
git clone https://github.com/siMoon646/TasteBudd-s.git
cd TasteBudd-s
```

**Backend** (Express)

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values (see below)
npx prisma generate    # generates Prisma Client from prisma/schema.prisma
npm run dev            # starts server.js with nodemon (auto-restarts on save)
```

**Frontend** (Vite + React)

```bash
cd frontend
npm install
cp .env.example .env   # then fill in the values (see below)
npm run dev            # Vite dev server, prints the local URL
```

**Run both at once** (from the repo root, after the two installs above)

```bash
npm install            # installs concurrently
npm run dev            # starts the backend (port 3000) and the frontend (port 5173) in one terminal
```

The Vite dev server proxies `/api` to the backend on port 3000, so the frontend can call `fetch('/api/...')` directly. The backend has to be running for those calls to work.

**Environment variables:** each `.env.example` lists the variables that folder needs. The values come from the Supabase dashboard; ask a teammate if you don't have access. `.env` files are gitignored; never commit them.
- `backend/.env`: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (used to verify access tokens; the backend won't start without them), `DATABASE_URL` (transaction pooler, used by Prisma Client at runtime), `DIRECT_URL` (session pooler, used by migrations)
- `frontend/.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

**Database:** the shared Supabase database is already migrated, so you don't need to run anything to start working. When you change `schema.prisma`, run `npx prisma migrate dev --name <change>` from `backend/` and commit the new folder in `prisma/migrations/`. `npx prisma migrate status` shows whether the database is up to date.

**Prisma 7 notes:**
- The database URL is set in `backend/prisma.config.ts`, not in `schema.prisma`. Prisma 7 rejects a `url` in the `datasource` block.
- VS Code's Prisma extension can check the schema against Prisma 6 rules. This repo's `.vscode/settings.json` sets `"prisma.pinToPrisma6": false`. If the editor still shows `Argument "url" is missing in data source block "db"`, run **Prisma: Restart Language Server** from the Command Palette.

- Prisma Client needs a driver adapter. `backend/lib/db.js` creates the one shared client using `@prisma/adapter-pg` over a `pg` connection pool pointed at `DATABASE_URL`. Import that instance (`import prisma from './lib/db.js'`) instead of calling `new PrismaClient()` elsewhere.

**Backend modules:** `backend/package.json` sets `"type": "module"`, so backend files use `import`/`export` and relative imports need the file extension (`'./lib/db.js'`).

**Not set up yet:** `backend/server.js` has one working route, `GET /api/users`, a test that returns every row in `users` to confirm the database connection. The real routes are mounted under `/api`, and their middleware works: routes that need a signed-in user return 401 without a valid Supabase access token, and errors come back as JSON. The user routes work (signup, profile read/update, follow/unfollow). Two post routes are written but not tested yet: `POST /api/posts` (create) and `GET /api/posts` (list). Creating a post with modules still fails because `moduleService.prepareModules` is a stub. The other post routes and the comment and feed controllers are still stubs that throw `Not implemented`, so a request to them that gets past auth gets HTTP 500.

**Testing auth:** open `/auth` in the frontend (a temporary dev panel) to sign up, sign in, and call `POST /api/users` with or without your access token. With a token you should get a 201 with the new profile (or a 409 if it already exists); without one, a 401.

## Documentation

- [Architecture](docs/ARCHITECTURE.md): request paths, backend layout, data integrity rules, real-time
- [Data Dictionary](docs/DATA_DICTIONARY.md): every table, column, enum, and constraint
- [TODO](docs/TODO.md): roadmap and task tracking
- [Project Board](docs/PROJECT_BOARD.md): progress log
- [AI Usage](docs/AI_USAGE.md): where and how AI assistance was used

## Status

Early scaffold — the Supabase database is provisioned and the initial Prisma migration is applied, and the backend starts and can query it through a shared Prisma Client (one test route, `GET /api/users`). The middleware now works: JSON body parsing, 404/error handling, and Supabase access-token auth (`requireAuth` / `optionalAuth`). The user API is implemented (signup, profile read/update, follow/unfollow). Creating and listing posts is written but untested; the rest of the post API, comments, and the feed are still stubs. The frontend has React Router routes for a landing page (header with Login/Signup links and placeholder posts rendered through the `Post` component), heading-only login and signup pages, a draft homepage layout (search bar + nav buttons), and an empty profile page. The only page that uses the Supabase client, calls the backend, or is styled with Tailwind so far is a temporary dev panel at `/auth`. The app itself isn't wired together yet. Bones so bare fr.

## Contributors

- Simon Tang
- Vanna Feng
- Emily Li
