# Implementation Plan: TWO STRANGERS, ONE SPACESHIP

## Overview

Static site (HTML, CSS, vanilla JS ES modules, Three.js) plus one Supabase project. Implementation language: **JavaScript (ES modules)** for the front end and tests, **SQL (Postgres)** for the back end, as fixed in design.md. Tasks are grouped by the six SD-01 milestones in order, followed by a deferred, optional P1 phase. Each milestone starts with a required start record and ends with a checkpoint that stops for user review.

Budget rules (Requirement 17, SD-01): absolute cap 200.00 credits. **SD-01 ceilings are maximums; unused allowance is not assumed available; the 5.00 contingency is locked.** Milestone ceilings: Foundation 14.00, Visual 26.00, Backend 38.00, Mechanics 26.00, Testing and security 22.00, Final polish 14.42 (these plus the 5.00 contingency sum to the 145.42 remaining at the SD-01 baseline). The contingency is released only by a recorded Scope_Decision. The P1 phase has no ceiling of its own. Do not rewrite working code. Do not write P1 work until every P0 item is verified and the P1 entry gate (task 7.1) has passed.

Supabase and GitHub steps that need the user's account cannot be run by the agent. Those tasks produce SQL files and docs, then tell the user exactly what to do.

### Credit record template

Every milestone start record (N.0) and every milestone checkpoint fills these fields. Actual, Allowance and Estimate stay in separate fields and are never merged.

| Field | Kind | Definition |
|---|---|---|
| Starting cumulative reading | Actual | Kiro usage-panel cumulative reading when the milestone starts (recorded in N.0) |
| Ending cumulative reading | Actual | Kiro usage-panel cumulative reading at the milestone checkpoint |
| Actual incremental milestone consumption | Actual | Ending cumulative reading minus starting cumulative reading |
| Milestone ceiling | SD-01 | 14.00 / 26.00 / 38.00 / 26.00 / 22.00 / 14.42 for Milestones 1 to 6 |
| Remaining milestone allowance | Allowance | Milestone ceiling minus actual incremental milestone consumption |
| Conservative remaining project budget | Allowance | 200.00 minus (latest cumulative reading plus the 10.00 allowance). The 10.00 is an allowance, not actual usage, and is reported separately |
| Estimated cost to complete the milestone and the project | Estimate | Forecast, labelled as an estimate |

Rules:
- Never subtract cumulative project usage from an individual milestone ceiling. Only the incremental figure (ending minus starting) is compared with the ceiling.
- If the estimate to complete the milestone exceeds the remaining milestone allowance, stop and request a Scope_Decision (defer per the drop order). Never use the 5.00 contingency without a recorded Scope_Decision.

## Tasks

- [ ] 1. Milestone 1: Project foundation (ceiling 14.00 credits)
  - [ ] 1.0 Milestone start record
    - Ask the user for the current cumulative Kiro usage-panel reading and record it as the Milestone 1 starting reading (Actual)
    - Record the ceiling 14.00, the remaining milestone allowance (ceiling, since incremental consumption is 0), the conservative remaining project budget (200.00 minus (reading plus 10.00 allowance)) and the estimate to complete, using the Credit record template
    - _Requirements: 16.2, 16.4, 17.3, 17.10_

  - [ ] 1.1 Scaffold the static app, config and core modules
    - Create `index.html` with the import map (pinned Three.js and supabase-js from a CDN) and a CSP `<meta>` tag (self, pinned CDN, Supabase host)
    - Create `.gitignore` (lists `config.js` and `.env.test`), `config.example.js` (placeholders for `SUPABASE_URL`, `SUPABASE_ANON_KEY`) and a dev-only `package.json` (`node --test`, `fast-check`)
    - Create `js/main.js` hash router with placeholder screens for `#/`, `#/room/<id>`, `#/join/<token>`; minimal `css/base.css`
    - Create `js/session.js` (anonymous sign-in, restore, one silent refresh), `js/api.js` skeleton with Postgres-error-to-message mapping (including `unique_violation` as `already_locked`), and `js/render.js` (`textContent` only)
    - Use relative asset paths only; no Service_Role_Key anywhere
    - _Requirements: 3.6, 4.2, 13.1, 13.2, 13.5, 13.7, 14.7, 14.9, 15.4_

  - [ ]* 1.2 Write property test for plain-text rendering
    - **Property 10: Plain-text rendering**
    - **Validates: Requirements 14.9**

  - [ ] 1.3 Draft `docs/SETUP.md`
    - Write the first draft of the Supabase steps (create project, enable Anonymous sign-ins, optional CAPTCHA, Site URL, `config.js` from `config.example.js`) and the local static-server command
    - State clearly which steps the user must do in their own Supabase and GitHub dashboards
    - _Requirements: 13.5, 13.6_

  - [ ] 1.4 Checkpoint - Milestone 1 review
    - Run the relevant tests (`node --test`) and report results
    - Record the ending cumulative usage-panel reading (Actual) and compute the actual incremental consumption (ending minus the 1.0 starting reading). Report the ceiling 14.00, the remaining milestone allowance (14.00 minus incremental consumption), the conservative remaining project budget (200.00 minus (latest cumulative reading plus the 10.00 allowance)) and the estimated cost to complete the milestone and the project (Estimate), each in its own field
    - Do not subtract cumulative usage from the ceiling. If the estimate exceeds the remaining allowance, stop and request a Scope_Decision
    - Ensure all tests pass, ask the user if questions arise. Stop for user review before Milestone 2.
    - _Requirements: 16.2, 16.3, 16.4, 17.3, 17.10_

- [ ] 2. Milestone 2: Visual environment (ceiling 26.00 credits)
  - [ ] 2.0 Milestone start record
    - Record the current cumulative usage-panel reading as the Milestone 2 starting reading (Actual); record ceiling 26.00, remaining milestone allowance, conservative remaining project budget and estimate to complete, per the Credit record template
    - _Requirements: 16.2, 16.4, 17.3, 17.10_

  - [ ] 2.1 Build the Three.js scene modules (reduced scope)
    - `js/scene/capability.js`: WebGL detection, device tier, reduced-motion detection
    - `js/scene/scene.js`: one renderer, scene and camera, DPR cap 1.5, loop paused when `document.hidden`, single static frame in reduced motion
    - `starfield.js` (one `Points`), `nebula.js` (canvas-texture sprites, one layer), `planet.js` (one sphere, per-mission palette swap function), `ship.js` (primitives)
    - Built-in materials only; no custom shaders, physics, post-processing or model files
    - If the ceiling is near, defer in this order: extra nebula and particles, ship detail, palette variety, opening camera move
    - _Requirements: 2.3, 2.5, 2.8, 2.9_

  - [ ] 2.2 Build glassmorphism styling, fallback and opening screen
    - `css/glass.css`, `css/fallback.css`; extend `css/base.css`: midnight blue and deep purple palette, electric blue and turquoise highlights, 44 px controls, visible focus ring, 4.5:1 body contrast, reflow at 320/768/1440 px, transitions at most 1 s
    - Opening screen in `index.html`/`js/main.js` with title, tagline and start action rendered immediately (text first, scene after)
    - _Requirements: 1.1, 2.1, 2.2, 2.4, 2.5, 2.7, 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ] 2.3 Wire scene, fallback and reduced motion into the app
    - Mount the scene behind all screens; on WebGL failure or renderer error remove the canvas and show the CSS Fallback_Presentation with all controls and text usable
    - Keep scene work off input handlers so controls respond within 200 ms
    - _Requirements: 2.1, 2.3, 2.6, 2.7_

  - [ ]* 2.4 Write unit tests for capability selection
    - Mock no-WebGL and reduced-motion; assert fallback and static-frame choices
    - _Requirements: 2.5, 2.6_

  - [ ] 2.5 Checkpoint - Milestone 2 review
    - Run the relevant tests and report results; list the manual checks for the user (opening screen within 3 s, WebGL-off fallback, reduced motion, no horizontal scroll at 320/768/1440 px)
    - Record the ending cumulative reading (Actual) and the actual incremental consumption (ending minus the 2.0 starting reading). Report ceiling 26.00, remaining milestone allowance (26.00 minus incremental consumption), conservative remaining project budget (200.00 minus (latest cumulative reading plus the 10.00 allowance)) and estimate to complete (Estimate), in separate fields
    - Never subtract cumulative usage from the ceiling. If the estimate exceeds the remaining allowance, stop and request a Scope_Decision
    - Ensure all tests pass, ask the user if questions arise. Stop for user review before Milestone 3.
    - _Requirements: 16.2, 16.4, 17.3, 17.10_

- [ ] 3. Milestone 3: Remote backend (ceiling 38.00 credits)
  - [ ] 3.0 Milestone start record
    - Record the current cumulative usage-panel reading as the Milestone 3 starting reading (Actual); record ceiling 38.00, remaining milestone allowance, conservative remaining project budget and estimate to complete, per the Credit record template
    - _Requirements: 16.2, 16.4, 17.3, 17.10_

  - [ ] 3.1 Write `sql/01_schema.sql`
    - Tables `rooms`, `players`, `missions`, `decisions`, `ships_log_entries`, `collectibles`, `messages`, `room_invites` (unique hash index), `mission_outcomes`, with all check constraints, unique constraints, the one-mission-entry index and 1 KB text caps
    - _Requirements: 13.4, 5.7, 14.5, 14.6, 14.8, 14.10_

  - [ ] 3.2 Write `sql/02_rls.sql`
    - RLS enabled on every table; `is_room_member` (`SECURITY DEFINER`, fixed `search_path`, owner `postgres`, grant to `authenticated` only)
    - SELECT-only policies per the design, including `decisions_select` (own row until `revealed`); no INSERT/UPDATE/DELETE policies or grants; `room_invites` with no policy and no grant
    - Revoke default function privileges from `anon`; Realtime publication limited to `rooms`, `players`, `missions`, `ships_log_entries`, `collectibles`
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.7, 4.7_

  - [ ] 3.3 Write `sql/03_rpc.sql` and `sql/04_compute_ending.sql`
    - RPCs: `create_room` (advisory lock, 3 waiting-room abuse limit), `join_room(p_token)`, `regenerate_invite`, `submit_decision` (server-side reveal, outcome and collectible lookup, `already_locked`, `outcome_missing`, mission 5 ending), `advance_mission`, `add_inside_joke` (1..140, 20 per player per Room), `touch_presence`
    - `create_room` and `regenerate_invite` return the plaintext invite token exactly once in the RPC response; only its SHA-256 hash is stored in `room_invites`; `regenerate_invite` invalidates the previous token
    - Every RPC: `SECURITY DEFINER`, `SET search_path = public, pg_temp`, explicit room id, `revoke ... from public, anon`, `grant ... to authenticated`
    - `compute_ending` deterministic, execute revoked from `public`, `anon` and `authenticated`
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 5.2, 5.4, 5.5, 5.6, 5.7, 6.7, 8.1, 8.3, 14.2, 14.4, 14.5, 14.6, 14.8, 14.10_

  - [ ] 3.4 Write `sql/seed_outcomes.sql`
    - 80 rows: 5 missions x 4 x 4 choices, category from {harmony, chaos, standoff, mischief, blunder}, collectible codes drawn from the six Collectibles
    - Spread categories so each appears in every mission and every Collectible is reachable
    - _Requirements: 5.5, 6.1, 6.2, 10.1, 10.2_

  - [ ] 3.5 Implement `js/api.js` wrappers, `js/state.js` and `js/sync.js`
    - RPC wrappers and RLS-filtered reads; in-memory room state; Realtime nudges that trigger re-reads; 5 s polling fallback always available; connection status (connected, reconnecting, offline); `touch_presence` every 15 s; partner offline after 30 s
    - Retry action within 5 s on failure that keeps the unsent selection
    - _Requirements: 3.7, 4.1, 4.3, 4.4, 4.6, 4.7, 15.5, 15.7, 15.8_

  - [ ] 3.6 Build lobby screens
    - Create-room screen: take the plaintext token from the `create_room` response, build `#/join/<token>`, display the invite URL with a Copy action, and keep the token only in memory for the current page view. Do not persist the token anywhere client-side (no browser storage, cookies or URL state beyond the displayed link)
    - If the link is lost (refresh, new device), the Captain uses a "Regenerate invitation" action, which calls `regenerate_invite` and invalidates the previous token. Refresh shows no token and offers Regenerate
    - Waiting state, join flow from `#/join/<token>`, restore on `#/room/<id>`, and the error screens: invalid invitation, room is full, access denied, session expired (rejoin message)
    - This supersedes design.md's mention of keeping the plain token in localStorage; design.md should be aligned in a later approved edit.
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 4.2, 4.3, 15.1, 15.2, 15.3, 15.4_

  - [ ] 3.7 Write `docs/TESTING.md` and the test environment configuration
    - Environment: a controlled local Supabase stack via the Supabase CLI (`supabase start`, requires Docker) with anonymous sign-ins enabled in the local config and migrations applied from the `sql/` files; alternatively a dedicated throwaway Supabase test project. Never the production project. The Supabase CLI and Docker are dev-only tools, not runtime dependencies; no new runtime dependency is added
    - Configuration: tests read `SUPABASE_URL` and `SUPABASE_ANON_KEY` from environment variables, supplied by a git-ignored `.env.test` with committed `.env.test.example` placeholders. Confirm `.gitignore` lists `.env.test` and `config.js`. The service-role key is never used by client-facing tests, never written to any file, never committed and never in client code
    - Setup: `supabase start`, then `supabase db reset` (applies schema, policies, functions and seed). Teardown: sign out the three clients, then `supabase db reset` or `supabase stop`
    - Session creation: tests use supabase-js with the local URL and local anon key to create three independent clients, each calling `signInAnonymously()` with in-memory storage (`auth: { persistSession: false }`): Captain, Co-Pilot and Outsider (third session for non-member and third-player tests)
    - Describe the two layers: Layer A (client-facing, anon key and real anonymous sessions only) and Layer B (privileged database assertions, local stack only, via `supabase test db` pgTAP or psql as the local postgres role)
    - Add a reference to `docs/TESTING.md` in `docs/SETUP.md`
    - _Requirements: 13.6, 14.3, 14.7, 18.15_

  - [ ] 3.8 Write minimal required SQL checks in `tests/sql/basic.test.js`
    - Layer A, against the local stack or throwaway test project from `docs/TESTING.md` (never production), with the Captain, Co-Pilot and Outsider clients: other player's unrevealed decision returns zero rows (filtered and unfiltered); the Outsider reads zero rows; direct INSERT/UPDATE on `missions` and `decisions` fails; third join rejected
    - These checks are required, not optional
    - _Requirements: 5.3, 14.2, 14.3, 14.4, 14.6_

  - [ ] 3.9 Extend `docs/SETUP.md` with the user's Supabase steps
    - Exact order: enable Anonymous sign-ins, run `01_schema.sql`, `02_rls.sql`, `03_rpc.sql`, `04_compute_ending.sql`, `seed_outcomes.sql` in the SQL editor, confirm the Realtime publication, copy URL and anon key into `config.js`
    - Tell the user these steps must be done in their own dashboard and to report back; the agent cannot access it
    - _Requirements: 13.3, 13.6_

  - [ ] 3.10 Checkpoint - Milestone 3 review
    - Ask the user to start the local test stack per `docs/TESTING.md` (or apply the SQL to a throwaway project) and fill `.env.test`, then run `tests/sql/basic.test.js`; report results. Production is not used for tests
    - Confirm with two browsers: create, join, play Mission 1 to reveal; repeat submit returns `already_locked`; refresh on the create screen shows no token and offers Regenerate; old invite fails after regenerate
    - Record the ending cumulative reading (Actual) and the actual incremental consumption (ending minus the 3.0 starting reading). Report ceiling 38.00, remaining milestone allowance (38.00 minus incremental consumption), conservative remaining project budget (200.00 minus (latest cumulative reading plus the 10.00 allowance)) and estimate to complete (Estimate), in separate fields
    - Never subtract cumulative usage from the ceiling. If the estimate exceeds the remaining allowance, stop and request a Scope_Decision
    - Ensure all tests pass, ask the user if questions arise. Stop for user review before Milestone 4.
    - _Requirements: 16.2, 16.4, 17.3, 17.10, 18.2, 18.3, 18.4, 18.5_

- [ ] 4. Milestone 4: Game mechanics and personalisation (ceiling 26.00 credits)
  - [ ] 4.0 Milestone start record
    - Record the current cumulative usage-panel reading as the Milestone 4 starting reading (Actual); record ceiling 26.00, remaining milestone allowance, conservative remaining project budget and estimate to complete, per the Credit record template
    - _Requirements: 16.2, 16.4, 17.3, 17.10_

  - [ ] 4.1 Write static content modules
    - `js/content/missions.js` (five Missions in order, intro, four options each, 16 consequence texts per mission), `outcomes.js` (JS copy of the 80 rows), `endings.js` (four endings plus a pure ending function mirroring `compute_ending`), `collectibles.js` (six items)
    - Mission 04 mixes light preference and hypothetical-future questions into the story; tone is playful and mildly sarcastic, never a personality quiz
    - _Requirements: 1.2, 1.3, 5.1, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 10.2_

  - [ ]* 4.2 Write property test for outcome lookup totality
    - **Property 1: Outcome lookup is total**
    - **Validates: Requirements 5.5, 6.2**

  - [ ]* 4.3 Write property test for JS mapping equal to seed SQL
    - **Property 2: JS outcome mapping equals seed SQL**
    - **Validates: Requirements 5.5, 10.1**

  - [ ]* 4.4 Write property test for ending totality and determinism
    - **Property 7: Ending is total and deterministic**
    - **Validates: Requirements 6.7**

  - [ ] 4.5 Implement Ships_AI
    - `js/content/ai_templates.js` (at least 3 templates per outcome category) and `js/ai/ships_ai.js` (seeded PRNG from room id and ordered history, history replay with no template reuse, current-decision comment, earlier-callback comment, recurring-joke detection, Captain vs Co-Pilot comparison after Mission 02)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ]* 4.6 Write property test for Ships_AI determinism
    - **Property 3: Ships_AI is deterministic**
    - **Validates: Requirements 7.1, 7.7**

  - [ ]* 4.7 Write property test for no template repeats
    - **Property 4: Ships_AI never repeats a template within a Room**
    - **Validates: Requirements 7.5**

  - [ ]* 4.8 Write property test for current and earlier references
    - **Property 5: Ships_AI comments reference the current and earlier decisions**
    - **Validates: Requirements 7.2, 7.3**

  - [ ]* 4.9 Write property test for recurring-joke trigger
    - **Property 6: Recurring pattern triggers the recurring-joke comment**
    - **Validates: Requirements 7.6**

  - [ ] 4.10 Build basic Inside_Jokes, Ships_Log view and collectibles inventory
    - `js/validate.js` (trimmed length 1..140), joke entry UI calling `add_inside_joke`, Ships_Log screen (mission entries and jokes, available after the first Reveal), inventory panel for the six Collectibles
    - Basic Inside_Jokes are P0 and required
    - _Requirements: 8.1, 8.2, 8.3, 10.1, 10.3, 14.8, 14.9, 18.8, 18.10_

  - [ ]* 4.11 Write property test for Inside_Joke validation
    - **Property 9: Inside_Joke validation**
    - **Validates: Requirements 8.3, 14.8**

  - [ ] 4.12 Build the Mission play flow
    - Mission screen: shared intro and four options, confirm and submit, "submitted" state, waiting panel naming the pending role, "Decision already locked" message, Reveal view with both decisions, consequence text, Ships_AI comments and "Mission N of 5", `advance_mission`, per-mission planet palette, Mission 05 ending display and journal offer
    - Restore submitted or unsubmitted state on refresh
    - _Requirements: 4.5, 5.1, 5.2, 5.4, 5.5, 5.6, 5.7, 5.8, 6.8, 6.9, 15.6, 15.8, 18.11_

  - [ ] 4.13 Build Adventure_Journal
    - `js/journal.js` builds mission history, both decisions per mission, summaries, collectibles, final destination, overall outcome and Inside_Jokes from log entries; journal screen shown after Mission 05 and when a completed Room is reopened
    - _Requirements: 11.1, 11.3, 18.12_

  - [ ]* 4.14 Write property test for journal completeness
    - **Property 8: Journal includes every log entry**
    - **Validates: Requirements 11.1, 11.3, 8.2**

  - [ ] 4.15 Checkpoint - Milestone 4 review
    - Run `node --test` and report results; confirm all five Missions are completable by two remote players and both see identical Ships_AI text
    - Report that no P1 item has been built. P1 work is deferred to the optional section 7 and only starts after the 7.1 gate passes
    - Record the ending cumulative reading (Actual) and the actual incremental consumption (ending minus the 4.0 starting reading). Report ceiling 26.00, remaining milestone allowance (26.00 minus incremental consumption), conservative remaining project budget (200.00 minus (latest cumulative reading plus the 10.00 allowance)) and estimate to complete (Estimate), in separate fields
    - Never subtract cumulative usage from the ceiling. If the estimate exceeds the remaining allowance, stop and request a Scope_Decision
    - Ensure all tests pass, ask the user if questions arise. Stop for user review before Milestone 5.
    - _Requirements: 16.2, 16.4, 17.3, 17.4, 17.6, 17.10, 18.7, 18.11_

- [ ] 5. Milestone 5: Testing and security (ceiling 22.00 credits)
  - [ ] 5.0 Milestone start record
    - Record the current cumulative usage-panel reading as the Milestone 5 starting reading (Actual); record ceiling 22.00, remaining milestone allowance, conservative remaining project budget and estimate to complete, per the Credit record template
    - _Requirements: 16.2, 16.4, 17.3, 17.10_

  - [ ] 5.1 Write the Layer B privileged database assertions (`tests/db/`)
    - Required, not optional. Run only against the local Supabase stack from `docs/TESTING.md`, via `supabase test db` (pgTAP) or psql as the local postgres role. Never the production project
    - Assert: RLS enabled on every table; function grants (REVOKE from public and anon on every RPC and on `is_room_member`; `compute_ending` not executable by `authenticated`); no INSERT/UPDATE/DELETE grants or policies for client roles; `room_invites` inaccessible to `anon` and `authenticated`; Realtime publication contains only `rooms`, `players`, `missions`, `ships_log_entries`, `collectibles`; `outcome_missing` path raises when an outcome row is removed; `mission_outcomes` seed row count is 80; Mission 5 reveal sets `ending_code` and status `completed`
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [ ] 5.2 Write the Layer A two-session attack script (`tests/attack/`)
    - Required, not optional. Client-facing only: supabase-js with the local URL and local anon key, three independent clients (Captain, Co-Pilot, Outsider), each using `signInAnonymously()` with `auth: { persistSession: false }`. No service-role key
    - Cases: RLS direct-query reads; PostgREST filtered and unfiltered selects; RPCs with a wrong room id and non-member RPCs; no reveal while waiting; attempts to write the revealed flag; insert a decision for the other player; update and delete a decision; third-player join rejected; partner-choice privacy and reveal; idempotent submit/advance/join; `already_locked` response; old invite rejected after regenerate (same `invalid_invite` for malformed and unknown); refresh of the create screen shows no token and offers Regenerate (client state test); 6 parallel `create_room` yield exactly 3 successes; joke cap and length (21st and 141 chars fail); Realtime on `decisions` does not leak the other player's unrevealed choice
    - The P1 secret-message cap case belongs to section 7 and runs only if P1 SQL was applied
    - _Requirements: 5.3, 5.4, 5.7, 14.2, 14.3, 14.4, 14.5, 14.6, 14.8, 14.10_

  - [ ] 5.3 Write the direct-query test with the Public_Anon_Key (`tests/attack/direct_query.test.js`)
    - Required, not optional. Layer A: using only the public anon key and real anonymous sessions (in-memory storage), assert the other player's unrevealed Decision is unreachable by filtered, unfiltered and joined queries and by Realtime on `decisions`; scan the repo for a Service_Role_Key pattern and for any `localStorage` token persistence of invite tokens
    - Reads `SUPABASE_URL` and `SUPABASE_ANON_KEY` from environment variables (`.env.test`); never the production project
    - _Requirements: 14.3, 14.7, 18.15_

  - [ ]* 5.4 Write remaining unit and example tests
    - At least 3 templates per category, 80 outcome rows present, validator edges (empty, 140, 141, whitespace), `api.js` error mapping, journal with no jokes
    - _Requirements: 7.5, 8.3, 11.1, 15.1_

  - [ ] 5.5 Write `docs/RELEASE_CHECKLIST.md`
    - Req 18 gates with pass/waive columns, manual checks (320/768/1440 px, keyboard focus order, contrast, reduced motion, WebGL off, two real devices), and the rule that a dropped P1 gate needs a recorded Scope_Decision
    - _Requirements: 12.1, 12.3, 12.4, 18.1, 18.13, 18.16_

  - [ ] 5.6 Checkpoint - Milestone 5 review
    - Run all tests (Layer A and Layer B) against the local stack and report results; every attack must be blocked and every required security test must pass
    - Record the ending cumulative reading (Actual) and the actual incremental consumption (ending minus the 5.0 starting reading). Report ceiling 22.00, remaining milestone allowance (22.00 minus incremental consumption), conservative remaining project budget (200.00 minus (latest cumulative reading plus the 10.00 allowance)) and estimate to complete (Estimate), in separate fields
    - Never subtract cumulative usage from the ceiling. If the estimate exceeds the remaining allowance, stop and request a Scope_Decision
    - Ensure all tests pass, ask the user if questions arise. Stop for user review before Milestone 6.
    - _Requirements: 16.4, 17.3, 17.10, 18.15_

- [ ] 6. Milestone 6: Final polish (ceiling 14.42 credits)
  - [ ] 6.0 Milestone start record
    - Record the current cumulative usage-panel reading as the Milestone 6 starting reading (Actual); record ceiling 14.42, remaining milestone allowance, conservative remaining project budget and estimate to complete, per the Credit record template
    - _Requirements: 16.2, 16.4, 17.3, 17.10_

  - [ ] 6.1 Copy, tone and performance pass
    - Tighten copy and error messages in tone; check transition timing at most 1 s; tune particle counts per device tier; no new features or refactors of working code
    - Cut visual tuning first if the ceiling is near
    - _Requirements: 1.2, 2.4, 2.7, 15.1_

  - [ ] 6.2 Finalize `docs/SETUP.md` and GitHub Pages deployment
    - Audit all asset and import paths as relative; document the deploy-branch flow (commit the filled `config.js` on the deploy branch only, enable Pages for that branch, set Supabase Site URL); add `scripts/deploy.md` or a short script that creates the deploy branch contents
    - Tell the user the Pages and Supabase dashboard steps they must perform; the agent cannot do them
    - _Requirements: 13.2, 13.5, 13.6, 14.7, 18.14_

  - [ ] 6.3 Write the production smoke test (`tests/smoke.mjs`)
    - Takes the published URL, checks that the page loads, `config.js` is present with only the public key, relative assets resolve, and the direct-query test passes against production (read-only checks with the public key; the destructive attack scripts never run against production)
    - _Requirements: 13.2, 14.7, 18.14, 18.15_

  - [ ] 6.4 Final checkpoint - Release review
    - Run all tests against the local stack and the smoke test against the user-supplied Pages URL; walk the release checklist and list every P1 gate waived or deferred
    - Record the ending cumulative reading (Actual) and the actual incremental consumption (ending minus the 6.0 starting reading). Report ceiling 14.42, remaining milestone allowance (14.42 minus incremental consumption), the total cumulative reading against the 200.00 cap, and the conservative remaining project budget (200.00 minus (latest cumulative reading plus the 10.00 allowance)), in separate fields. The 5.00 contingency stays locked
    - Ensure all tests pass, ask the user if questions arise.
    - _Requirements: 16.4, 17.1, 17.3, 17.9, 17.10, 18.1_

- [ ] 7. Deferred P1 phase (optional; no dedicated ceiling — funded only by a recorded Scope_Decision from remaining milestone allowances; locked contingency not usable)
  - Every item below except the gate 7.1 is optional. Build order: P1 SQL, alien creator, Inside_Joke callbacks and discovery, secret messages, Easter eggs, journal export. Drop order (first to drop first): journal export, Easter eggs, secret messages, Inside_Joke callbacks and discovery, alien creator
  - [ ] 7.1 P1 entry gate (not optional)
    - Proceed only if all of the following hold, and record the result as a Scope_Decision. If any condition fails, skip the whole phase
    - (a) The Milestone 3 and Milestone 4 P0 checkpoints (3.10 and 4.15) passed. For P1 SQL, the Milestone 3 checkpoint passing is required; for P1 client features, the Milestone 4 checkpoint passing is required
    - (b) All required P0 tests passed (including the required security tests in Milestone 5)
    - (c) The user explicitly approved proceeding
    - (d) The latest usage-panel reading and the forecast (Estimate) for the selected P1 items fit within the remaining milestone allowances (ceiling minus incremental consumption, never cumulative usage) and within the conservative remaining project budget (200.00 minus (latest cumulative reading plus the 10.00 allowance)). The 5.00 contingency is not usable
    - _Requirements: 17.4, 17.6, 17.10, 18.7_

  - [ ]* 7.2 Write `sql/p1_features.sql` (P1 BEGIN/END blocks)
    - `add_secret_message` (1..280, max 5 per player, reveal 2..5), `submit_alien_traits` and the `messages_select` policy, each in a droppable block with the same grant rules (`SECURITY DEFINER`, fixed `search_path`, revoke from `public` and `anon`, grant to `authenticated`)
    - Requires the 7.1 gate
    - _Requirements: 8.4, 8.5, 9.1, 9.2, 14.8_

  - [ ]* 7.3 Write P1 SQL tests
    - Layer A and Layer B checks for the P1 blocks on the local stack: secret-message cap (6th fails) and length (281 fails), `messages_select` hides a message until its reveal mission, `submit_alien_traits` grants, publication still limited to the five allowed tables
    - _Requirements: 8.4, 8.5, 14.8_

  - [ ]* 7.4 P1: Alien creator
    - `js/p1/alien.js` (predefined traits, deterministic generator), UI for Captain physical and Co-Pilot personality choices via `submit_alien_traits`, save to Ships_Log, show to both Players, list in Ships_Log; no external AI
    - _Requirements: 8.6, 9.1, 9.2, 9.3, 9.4, 9.5, 18.9_

  - [ ]* 7.5 Write property test for alien generation
    - **Property 12: Alien generation is deterministic and complete (P1)**
    - **Validates: Requirements 9.3, 9.5**

  - [ ]* 7.6 P1: Inside_Joke callbacks and discovery
    - `js/p1/joke_callbacks.js` lets Ships_AI mention saved jokes; include jokes in the Easter_Egg trigger data
    - _Requirements: 8.3, 7.3, 11.2_

  - [ ]* 7.7 P1: Secret messages
    - `js/p1/secret_messages.js` and UI: write a message (1..280) with a reveal mission, hidden from the partner until the scheduled Mission reveal, then shown and added to the Ships_Log and journal
    - _Requirements: 8.4, 8.5, 11.2_

  - [ ]* 7.8 Write property test for secret message validation
    - **Property 11: Secret message validation (P1)**
    - **Validates: Requirements 8.4, 14.8**

  - [ ]* 7.9 P1: Easter eggs
    - `js/p1/easter_eggs.js`: at least five, at least two triggered by earlier Decisions or Inside_Jokes
    - _Requirements: 10.4, 10.5_

  - [ ]* 7.10 P1: Journal export
    - `js/p1/journal_export.js`: text summary or downloadable file within 5 seconds
    - _Requirements: 11.2, 11.4_

  - [ ]* 7.11 Write property test for journal export
    - **Property 13: Journal export contains the journal (P1)**
    - **Validates: Requirements 11.4**

  - [ ]* 7.12 P1 checkpoint
    - Run `node --test` and the Layer A and Layer B suites; report which P1 items were built and which were dropped (in the drop order) for the user to record as Scope_Decisions
    - Record the ending cumulative reading (Actual), the incremental P1 consumption, the remaining milestone allowances and the conservative remaining project budget (200.00 minus (latest cumulative reading plus the 10.00 allowance)) in separate fields. Do not exceed the amounts approved in the 7.1 Scope_Decision
    - Ensure all tests pass, ask the user if questions arise.
    - _Requirements: 16.4, 17.4, 17.10_

## Notes

- Tasks marked with `*` are optional and can be skipped. All P1 work lives in section 7 and is optional, gated by 7.1, and ordered so the last item is the first to drop: journal export, Easter eggs, secret messages, Inside_Joke callbacks and discovery, alien creator.
- The Layer A and Layer B security tests, attack script and direct-query test are required, not optional. They run only against the local Supabase stack or a throwaway test project, never production.
- The Supabase CLI and Docker are dev-only tools and are not runtime dependencies.
- Property tests use `node --test` with `fast-check` (at least 100 runs), tagged `Feature: two-strangers-one-spaceship, Property N: <title>`.
- Each milestone start record and checkpoint reports Actual, Allowance and Estimate separately; allowances and estimates are never reported as actual, and cumulative usage is never subtracted from a milestone ceiling.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.0"] },
    { "id": 1, "tasks": ["1.1"] },
    { "id": 2, "tasks": ["1.2", "1.3"] },
    { "id": 3, "tasks": ["1.4"] },
    { "id": 4, "tasks": ["2.0"] },
    { "id": 5, "tasks": ["2.1", "2.2"] },
    { "id": 6, "tasks": ["2.3"] },
    { "id": 7, "tasks": ["2.4"] },
    { "id": 8, "tasks": ["2.5"] },
    { "id": 9, "tasks": ["3.0"] },
    { "id": 10, "tasks": ["3.1"] },
    { "id": 11, "tasks": ["3.2"] },
    { "id": 12, "tasks": ["3.3", "3.4", "3.7"] },
    { "id": 13, "tasks": ["3.5", "3.8", "3.9"] },
    { "id": 14, "tasks": ["3.6"] },
    { "id": 15, "tasks": ["3.10"] },
    { "id": 16, "tasks": ["4.0"] },
    { "id": 17, "tasks": ["4.1"] },
    { "id": 18, "tasks": ["4.2", "4.3", "4.4", "4.5", "4.10"] },
    { "id": 19, "tasks": ["4.6", "4.7", "4.8", "4.9", "4.11"] },
    { "id": 20, "tasks": ["4.12"] },
    { "id": 21, "tasks": ["4.13"] },
    { "id": 22, "tasks": ["4.14"] },
    { "id": 23, "tasks": ["4.15"] },
    { "id": 24, "tasks": ["5.0"] },
    { "id": 25, "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5"] },
    { "id": 26, "tasks": ["5.6"] },
    { "id": 27, "tasks": ["6.0"] },
    { "id": 28, "tasks": ["6.1", "6.2", "6.3"] },
    { "id": 29, "tasks": ["6.4"] },
    { "id": 30, "tasks": ["7.1"] },
    { "id": 31, "tasks": ["7.2"] },
    { "id": 32, "tasks": ["7.3", "7.4"] },
    { "id": 33, "tasks": ["7.5", "7.6"] },
    { "id": 34, "tasks": ["7.7"] },
    { "id": 35, "tasks": ["7.8", "7.9"] },
    { "id": 36, "tasks": ["7.10"] },
    { "id": 37, "tasks": ["7.11"] },
    { "id": 38, "tasks": ["7.12"] }
  ]
}
```
