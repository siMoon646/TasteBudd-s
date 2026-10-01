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
- Prisma (ORM for all backend reads, writes & business logic)
- PostgreSQL

**Frontend**
- Vite + React
- Tailwind CSS

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
npm run dev        # starts server.js with nodemon (auto-restarts on save)
```

**Frontend** (Vite + React)

```bash
cd frontend
npm install
npm run dev        # Vite dev server, prints the local URL
```

**Not set up yet** (these steps will be added here as they land; see [TODO → Infrastructure](docs/TODO.md#infrastructure)):
- **Environment variables:** `backend/.env` will need `DATABASE_URL` and the Supabase keys, and `frontend/.env` will need `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. `.env` files are gitignored; never commit them.
- **Database:** install Prisma Client and run the first migration (`npx prisma migrate dev`).
- **Wiring:** `backend/server.js` is still empty, so the backend doesn't serve anything yet.

## Documentation

- [Architecture](docs/ARCHITECTURE.md): request paths, backend layout, data integrity rules, real-time
- [Data Dictionary](docs/DATA_DICTIONARY.md): every table, column, enum, and constraint
- [TODO](docs/TODO.md): roadmap and task tracking
- [Project Board](docs/PROJECT_BOARD.md): progress log

## Status

Early scaffold — backend has stubbed routes/controllers/services/middleware (no logic yet, not mounted in `server.js`), frontend is a stock Vite + React setup. Nothing is wired together yet. Bones so bare fr.

## Contributors

- Simon Tang
- Vanna Feng
- Emily Li
