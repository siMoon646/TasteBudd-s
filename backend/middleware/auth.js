// Auth middleware. Auth is Supabase Auth: the frontend signs in with
// supabase-js and sends its access token; the backend only verifies it.
//
// Tokens are verified with supabase.auth.getClaims(), which checks the JWT's
// signature locally against the project's public keys (fetched once, then
// cached) instead of calling Supabase on every request. Tradeoff: a token
// stays valid until it expires (1 hour), even after the user signs out.

import { isAuthRetryableFetchError } from '@supabase/supabase-js';
import supabase from '../lib/supabase.js';
import prisma from '../lib/db.js';

/** Returns the token from `Authorization: Bearer <jwt>`, or null if absent. */
function getBearerToken(req) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  return scheme?.toLowerCase() === 'bearer' && token ? token : null;
}

/**
 * Verifies the token and returns its claims, or null if it's invalid/expired.
 * Throws a 503 if Supabase can't be reached (e.g. fetching the public keys
 * failed), so an outage isn't reported to the client as "you're logged out".
 */
async function verifyToken(token) {
  const { data, error } = await supabase.auth.getClaims(token);
  if (error) {
    if (isAuthRetryableFetchError(error)) {
      const outage = new Error('Auth service unavailable');
      outage.status = 503;
      throw outage;
    }
    return null;
  }
  return data.claims;
}

/**
 * Builds req.user from verified claims. `id` is always set (the Supabase auth
 * user id, `sub`). `username` is null until the profile row exists — that's
 * the normal state during signup, before POST /api/users creates it.
 */
async function loadUser(claims) {
  const profile = await prisma.user.findUnique({
    where: { id: claims.sub },
    select: { username: true },
  });
  return { id: claims.sub, email: claims.email, username: profile?.username ?? null };
}

/**
 * Requires a signed-in user.
 * Sets `req.user` ({ id, email, username }) or responds 401.
 */
async function requireAuth(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  const claims = await verifyToken(token);
  if (!claims) {
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }

  req.user = await loadUser(claims);
  next();
}

/**
 * Same as requireAuth, but lets anonymous requests through.
 * Sets `req.user` when a valid token is present, leaves it undefined otherwise.
 * Useful for public reads that show extra info to signed-in users
 * (e.g. whether the viewer has liked/saved a post).
 */
async function optionalAuth(req, res, next) {
  const token = getBearerToken(req);
  const claims = token ? await verifyToken(token) : null;
  if (claims) {
    req.user = await loadUser(claims);
  }
  next();
}

export { requireAuth, optionalAuth };