# TasteBudd's

A social media platform centered around food.

TasteBudd's is built on the idea that food content deserves a different kind of post than a typical social feed offers. Where conventional platforms treat every post as a photo-and-caption, TasteBudd's introduces **modular posts**: build a single post out of interchangeable pieces — a checklist for ingredients or steps, an embedded video for a follow-along tutorial, a timer for tracking cook time, and more — so a post can actually match how people cook and eat, not just how they scroll.

Later on (post-MVP), posts will also be able to carry an optional location tag, powering a dedicated **location-based feed**: using your device's location, browse posts pinned nearby within a range you control.

## Inspirations
- TBD...

## Features

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
- Tailwind CSS (?)

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

**Environment variables:** each `.env.example` lists the variables that folder needs. The values come from the Supabase dashboard; ask a teammate if you don't have access. `.env` files are gitignored; never commit them.
- `backend/.env`: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `DATABASE_URL` (transaction pooler, used by Prisma Client at runtime), `DIRECT_URL` (session pooler, used by migrations)
- `frontend/.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

**Database:** the shared Supabase database is already migrated, so you don't need to run anything to start working. When you change `schema.prisma`, run `npx prisma migrate dev --name <change>` from `backend/` and commit the new folder in `prisma/migrations/`. `npx prisma migrate status` shows whether the database is up to date.

**Prisma 7 notes:**
- The database URL is set in `backend/prisma.config.ts`, not in `schema.prisma`. Prisma 7 rejects a `url` in the `datasource` block.
- VS Code's Prisma extension can check the schema against Prisma 6 rules. This repo's `.vscode/settings.json` sets `"prisma.pinToPrisma6": false`. If the editor still shows `Argument "url" is missing in data source block "db"`, run **Prisma: Restart Language Server** from the Command Palette.

**Not set up yet:** `backend/server.js` is still empty, so the backend doesn't serve anything yet.

## Documentation

- [Architecture](docs/ARCHITECTURE.md): request paths, backend layout, data integrity rules, real-time
- [Data Dictionary](docs/DATA_DICTIONARY.md): every table, column, enum, and constraint
- [TODO](docs/TODO.md): roadmap and task tracking
- [Project Board](docs/PROJECT_BOARD.md): progress log
- [AI Usage](docs/AI_USAGE.md): where and how AI assistance was used

## Status

Early scaffold — the Supabase database is provisioned and the initial Prisma migration is applied, but the backend has only stubbed routes/controllers/services/middleware (no logic yet, not mounted in `server.js`), and the frontend has only a draft homepage layout (search bar + nav buttons) and empty login/profile pages. The app itself isn't wired together yet. Bones so bare fr.

## Contributors

- Simon Tang
- Vanna Feng
- Emily Li
