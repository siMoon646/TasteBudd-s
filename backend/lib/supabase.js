// Load the variables from backend/.env into process.env (must run before they're read below)
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY (see backend/.env.example)',
  );
}

// Server-side client: only used to verify access tokens (supabase.auth.getClaims).
// The server never signs anyone in itself, so session storage and auto-refresh are off.
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

// Export the single shared client, like lib/db.js does for Prisma
export default supabase;