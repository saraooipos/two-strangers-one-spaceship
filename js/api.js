// Supabase client, RPC wrappers (skeleton) and error mapping.
// The browser only calls RPCs for writes and RLS-filtered selects for reads.
// The supabase-js import is lazy so the pure error mapping stays testable in Node.

import { ensureSession, recoverSession } from './session.js';

export const ERROR_MESSAGES = {
  not_member: "That room isn't yours to enter. Check your invitation link.",
  not_captain: 'Only the Captain can do that. Rank has its privileges.',
  room_full: 'This ship already has two crew members. No stowaways.',
  room_not_waiting: 'This ship has already left the dock.',
  room_not_active: 'This mission is not underway yet.',
  invalid_invite: 'That invitation is invalid or has expired. You can start a new room.',
  too_many_waiting_rooms: 'You already have three ships waiting. Fill one before building another.',
  wrong_mission: 'The ship has moved on to another mission. Refreshing the view.',
  not_revealed: 'The reveal has not happened yet. Patience, Captain.',
  bad_choice: 'That is not one of the four options.',
  bad_length: 'That text is the wrong length.',
  too_many_jokes: 'The ship log has heard enough jokes from you for now.',
  outcome_missing: 'The ship could not work out what happened. Please try again.',
  already_locked: 'Decision already locked.',
  session_expired: 'Your session has expired. Please rejoin through the invitation link.',
  network: 'Could not reach the ship. Check your connection and retry.',
  unknown: 'Something went wrong on the ship. Please retry.',
};

const KNOWN = new Set(Object.keys(ERROR_MESSAGES));

/**
 * Maps a Postgres/Supabase/network error to { code, message, retryable }.
 * Our RPCs raise exceptions whose message is the code (for example 'not_member').
 * Postgres SQLSTATE 23505 (unique_violation) maps to already_locked.
 */
export function mapError(err) {
  if (!err) return { code: 'unknown', message: ERROR_MESSAGES.unknown, retryable: true };

  const rawMessage = typeof err.message === 'string' ? err.message.trim() : '';
  let code = null;

  if (KNOWN.has(rawMessage)) {
    code = rawMessage;
  } else {
    const found = [...KNOWN].find((c) => c !== 'unknown' && rawMessage.includes(c));
    if (found) code = found;
  }

  if (!code && (err.code === '23505' || err.code === 'unique_violation')) {
    code = 'already_locked';
  }
  if (!code && KNOWN.has(err.code)) code = err.code;

  if (!code && (err.code === 'session_expired' || err.status === 401)) {
    code = 'session_expired';
  }
  if (!code && (err instanceof TypeError || /failed to fetch|network/i.test(rawMessage))) {
    code = 'network';
  }
  if (!code) code = 'unknown';

  const retryable = code === 'network' || code === 'unknown' || code === 'outcome_missing';
  return { code, message: ERROR_MESSAGES[code], retryable };
}

let clientPromise = null;

/** Creates the single Supabase client from config.js (git-ignored) and the pinned CDN module. */
export function getClient() {
  if (!clientPromise) {
    clientPromise = (async () => {
      let config;
      try {
        config = await import('../config.js');
      } catch {
        const e = new Error('Missing config.js. Copy config.example.js to config.js and fill it in.');
        e.code = 'unknown';
        throw e;
      }
      const { createClient } = await import('@supabase/supabase-js');
      return createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
    })();
    clientPromise.catch(() => { clientPromise = null; });
  }
  return clientPromise;
}

/** Signs in anonymously (or restores) and returns the session. */
export async function startSession() {
  const client = await getClient();
  return ensureSession(client);
}

/** Calls an RPC. Throws a mapped error { code, message, retryable }. */
async function rpc(name, args) {
  const client = await getClient();
  let { data, error } = await client.rpc(name, args);
  if (error && (error.status === 401 || /jwt/i.test(error.message || ''))) {
    await recoverSession(client).catch((e) => { throw mapError(e); });
    ({ data, error } = await client.rpc(name, args));
  }
  if (error) throw mapError(error);
  return data;
}

export const createRoom = () => rpc('create_room', {});
export const joinRoom = (token) => rpc('join_room', { p_token: token });
export const regenerateInvite = (roomId) => rpc('regenerate_invite', { p_room_id: roomId });
export const advanceMission = (roomId, expected) =>
  rpc('advance_mission', { p_room_id: roomId, p_expected_mission: expected });
export const addInsideJoke = (roomId, text) =>
  rpc('add_inside_joke', { p_room_id: roomId, p_text: text });
export const touchPresence = (roomId) => rpc('touch_presence', { p_room_id: roomId });

/**
 * A unique_violation race (code 23505) is treated as already_locked by the caller:
 * the result carries already_locked: true and the caller re-reads state.
 */
export async function submitDecision(roomId, missionNumber, choice) {
  try {
    return await rpc('submit_decision', {
      p_room_id: roomId,
      p_mission_number: missionNumber,
      p_choice: choice,
    });
  } catch (e) {
    if (e && e.code === 'already_locked') return { already_locked: true, revealed: false };
    throw e;
  }
}
