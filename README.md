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

- **Writes & business logic** (e.g. constructing a modular post) go through the Node backend via Prisma.

- **Reads & real-time subscriptions** (e.g. live comment updates) go directly from the frontend to Supabase.

## Status

Early scaffold — backend is a bare Node/Express server, frontend is a stock Vite + React setup. Nothing is wired together yet. Bones so bare fr.

## Contributors

- Simon Tang
- Vanna Feng
- Emily Li
