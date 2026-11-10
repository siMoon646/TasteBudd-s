# AI usage

## 10/23/2026
The `createPost` and `listPosts` services and controllers were written by the team, with Claude Code (Claude, Anthropic) as a tutor and reviewer.

- **Explanations:** what happens without `await` (a Promise serializes to `{}`, unhandled rejections), HTTP 400 vs. 422, optional chaining (`?.`), why `?? {}` is used before destructuring, De Morgan's law in validation checks, `req.query` (values are always strings), cursor pagination, Prisma `take` / `cursor` / `skip` / `include` / `select`, module scope, and why calling `getPostById` per post would cause N+1 queries.
- **Review:** checked each version of both functions and their comments, pointed out bugs, and suggested fixes.
- **Code:** suggested corrected code that the team pasted in: the reordered validation checks in `createPost`, the `listPosts` controller, and the final `listPosts` service function with its comments.
- **Docs:** updated `TODO.md`, `ARCHITECTURE.md`, the README, the Project Board (10/23 entry), and this log.

## 10/21/2026
The user API code (`getUserProfile`, `updateUserProfile`, `followUser`, `unfollowUser`, and their controllers) was written by the team. Claude Code (Claude, Anthropic) was used as a tutor and reviewer.

- **Explanations:** JavaScript concepts (falsy values, `??`, `?.`, spread, ternaries, operator precedence, `try/catch` with `await`), Express (`req.params`, `res.status().end()`, response headers), Prisma queries and error codes (`P2002`, `P2003`, `P2025`), and `req.user.id` vs. the `:userId` route param.
- **Review:** checked each function and its comments, pointed out bugs and suggested fixes, and gave hints instead of full solutions for most of it. It wrote out the final `getUserProfile` service code after a hint-based attempt.
- **Code:** moved the `httpError` helper to `backend/lib/httpError.js`, added its import to every service, and rewrote one comment in `userService.js`.
- **Docs:** updated `TODO.md`, `ARCHITECTURE.md`, the README, the Project Board (10/21 entry), and this log. The changes were reviewed before they were accepted.

## 10/19/2026
- **Code:** Claude Code (Claude, Anthropic) wrote the dev-only auth test panel, `frontend/src/pages/AuthTest.jsx` (sign up/in/out, set password, and the `POST /api/users` buttons with and without the token).
- **Styling:** Microsoft Copilot styled the panel (new markup plus a separate `AuthTest.css`). Claude Code then converted that styling to Tailwind utility classes in `AuthTest.jsx` and deleted `AuthTest.css`, keeping the same look.
- **Docs:** Claude Code (Claude, Anthropic) updated the README, `ARCHITECTURE.md`, `TODO.md`, the Project Board (10/17 and 10/19 entries), and this log to match the auth middleware, error handling, `/auth` dev panel, and Vite proxy changes. The changes were reviewed before they were accepted.

## 10/04/2026
Claude Code (Claude, Anthropic) helped with the following, and each change was reviewed before it was accepted. The routing, pages, and Tailwind setup were done by the team.

- **Code:** wrote `frontend/src/supabase.js` (the shared Supabase client). Assisted in testing.
- **Explanations:** how Supabase invite links work, and which parts of auth belong in the frontend versus the backend.
- **Docs:** added the Supabase client and "Confirm email" items to `TODO.md`, and updated the README, `ARCHITECTURE.md`, `TODO.md`, the Project Board, and this log to match the 10/04 commits.

## 10/03/2026
- **Docs:** Claude Code updated the Project Board, `TODO.md`, and README status to reflect the frontend pages merged on 10/02 (homepage draft, login/profile stubs).

## 10/02/2026
The team did the Prisma 7 upgrade, Supabase setup, and initial migration. Claude Code (Claude, Anthropic) helped with the following, and each change was reviewed before it was accepted.

- **Debugging:** found why the VS Code Prisma extension still flagged the schema after the upgrade (its Prisma 6 language server was still running) and gave the fix (restart the language server).
- **Docs:** added the Gmail SMTP item to `TODO.md`, updated the README setup section, `TODO.md`, and this log, wrote the 10/02 Project Board entry, and created the `.env.example` files.

## 09/30/2026
Today's work was done with AI assistance: Claude (Anthropic), used through Claude Code in VS Code. Every change was reviewed before it was accepted, and some proposed changes were rejected. Product and design decisions (auth provider, data access approach, MVP scope, module names) were made by the team; the AI explained options and then updated files to match.

## Tool
- Claude Code

### What the AI did:
- **Backend scaffold:** created stub files in `routes/`, `controllers/`, `services/`, and `middleware/` with function signatures and comments only.
- **Schema:** added the `body_image` module type at the team's request and updated comments. No other structural changes.
- **Docs:**
  - Wrote `ARCHITECTURE.md`, moving the existing architecture notes into it and adding new sections on backend layout and Supabase Realtime.
  - Wrote the README's Setup and Documentation sections.
  - Reorganized `TODO.md` into MVP / Post-MVP / MDP.
  - Updated `DATA_DICTIONARY.md` to match decisions.
  - Moved and renamed files into `docs/`.
  - Drafted this 09/30 entry from the git history.
- **Review:** quality checks across the docs, explanations of options (e.g. reading data through Express vs. directly from Supabase), and recommendations the team accepted or declined.