// Anonymous sign-in, session restore, and a single silent refresh (Req 4.2, 15.4).
// supabase-js persists the session in localStorage, so the same device restores the same user.

export const REJOIN_MESSAGE =
  'Your session has expired. Please rejoin through the invitation link.';

/** Returns the stored session, or null. Never creates a user. */
export async function restoreSession(client) {
  const { data, error } = await client.auth.getSession();
  if (error) return null;
  return data.session ?? null;
}

/** Attempts exactly one refresh. Returns the new session, or null on failure. */
export async function refreshOnce(client) {
  try {
    const { data, error } = await client.auth.refreshSession();
    if (error) return null;
    return data.session ?? null;
  } catch {
    return null;
  }
}

/**
 * Restores the session or signs in anonymously.
 * If a stored session cannot be used, tries one silent refresh; on failure
 * throws an Error whose code is 'session_expired'.
 */
export async function ensureSession(client) {
  const existing = await restoreSession(client);
  if (existing) return existing;

  const { data, error } = await client.auth.signInAnonymously();
  if (error || !data.session) {
    const err = new Error(REJOIN_MESSAGE);
    err.code = 'session_expired';
    throw err;
  }
  return data.session;
}

/** For a request that failed with an auth error: one refresh, else the rejoin message. */
export async function recoverSession(client) {
  const session = await refreshOnce(client);
  if (session) return session;
  const err = new Error(REJOIN_MESSAGE);
  err.code = 'session_expired';
  throw err;
}
