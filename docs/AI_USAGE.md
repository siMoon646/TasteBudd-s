# AI usage
Today's work was done with AI assistance: Claude (Anthropic), used through Claude Code in VS Code. Every change was reviewed before it was accepted, and some proposed changes were rejected. Product and design decisions (auth provider, data access approach, MVP scope, module names) were made by the team; the AI explained options and then updated files to match.

## Tool
- Claude Code

What the AI did:
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