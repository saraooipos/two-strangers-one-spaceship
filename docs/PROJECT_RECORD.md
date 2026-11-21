# Project Record

## Milestone 1 checkpoint: Project foundation

**Checkpoint:** 1.4 Milestone 1 review  
**Status:** Stopped for user review; Milestone 2 has not started.  
**Starting cumulative reading:** 1.00 credits (Actual, recorded by task 1.0)  
**Ending cumulative reading:** 71.20 credits (Actual, supplied for this checkpoint from the Kiro usage panel)

### Credit record

| Field | Value | Kind | Calculation / note |
|---|---:|---|---|
| Starting cumulative reading | 1.00 | Actual | Milestone 1 starting reading |
| Ending cumulative reading | 71.20 | Actual | Ending Kiro usage-panel reading |
| Actual incremental Milestone 1 consumption | 70.20 | Actual | 71.20 − 1.00 |
| Milestone 1 ceiling | 14.00 | SD-01 | Project foundation maximum |
| Remaining Milestone 1 allowance | **−56.20** | Allowance | 14.00 − 70.20; the ceiling is exceeded |
| Usage-panel allowance | 10.00 | Allowance | Two unsaved design-document regeneration attempts; not actual usage |
| Conservative remaining project budget | 118.80 | Allowance | 200.00 − (71.20 + 10.00) |
| Estimated cost to complete Milestone 1 | 0.00 | Estimate | No implementation task remains in Milestone 1 after this checkpoint; task 1.2 is explicitly marked `[-]` |
| Estimated cost to complete planned project implementation | 126.42 | Estimate | Sum of Milestone 2–6 ceilings: 26.00 + 38.00 + 26.00 + 22.00 + 14.42; excludes the locked 5.00 contingency |
| Locked Unallocated_Contingency | 5.00 | Reserved | Not available without a recorded Scope_Decision |

### Implementation review

Milestone 1 files reviewed:

- `index.html`: static entry point, pinned Three.js and Supabase import-map entries, CSP, and relative asset paths.
- `js/main.js`: hash routes for home, room, join, and not-found screens.
- `js/session.js`: anonymous session restore, sign-in, and one refresh path.
- `js/api.js`: Supabase client loading, RPC wrappers, and error mapping including `unique_violation` to `already_locked`.
- `js/render.js`: DOM helpers that write player-visible strings through `textContent`.
- `css/base.css`: minimal palette, responsive-safe wrapping, 44px controls, and visible focus styling.
- `config.example.js` and `.gitignore`: public-key placeholders and ignored local configuration.
- `docs/SETUP.md`: Supabase, local static-server, and GitHub Pages setup instructions.

Task 1.2 is marked `[-]` in `tasks.md`, and no test files currently exist in the repository.

### Test record

Command run from the repository root:

```text
node --test
```

Result:

```text
ℹ tests 0
ℹ suites 0
ℹ pass 0
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 6.639375
```

The command exited with status 0. This confirms that the available Node test run has no failing tests, but it does not provide behavioral coverage because no tests are present yet.

### Budget gate and required decision

The calculated actual incremental consumption of 70.20 credits exceeds the Milestone 1 ceiling of 14.00 credits. Therefore the remaining allowance is negative, and even the 0.00 estimate to close Milestone 1 is greater than the remaining allowance of −56.20. A **Scope_Decision is required before any further implementation**, following the required order of simplifying or deferring P1 work and then reducing P0 polish. The locked 5.00 contingency is not available without that decision.

Milestone 2 was not started. No development server or other project process was started by this checkpoint.

## Scope_Decision SD-02: Pause and re-baseline scope

**Decision status:** Recorded from the checkpoint review.  
**Decision:** Pause implementation and re-baseline the scope and budget before Milestone 2.  
**Reason:** Milestone 1 actual incremental consumption is 70.20 credits against its 14.00-credit ceiling, leaving a calculated remaining allowance of −56.20 credits.  
**Effect:** Do not start Milestone 2 or any later implementation until the revised scope and budget are approved. The 5.00-credit Unallocated_Contingency remains locked, and this decision does not expand the 200.00-credit project cap.

## Scope_Decision SD-03: Proceed with reduced-scope visual environment

**Decision status:** Approved by the user for this execution.  
**Decision:** Proceed with Milestone 2's reduced-scope visual environment after the SD-02 pause.  
**Reason:** The user explicitly approved the staged Milestone 2 task and supplied the current usage-panel reading.  
**Limits:** No contingency is released. Extra nebulae and particles, detailed ship geometry, extensive palette variety and opening camera movement remain deferred. Later milestones require their own checkpoint and budget review.

## Milestone 2 start record: Visual environment

**Task:** 2.0 Milestone start record  
**Starting cumulative reading:** 71.20 credits (Actual, supplied from the Kiro usage panel)  
**Milestone ceiling:** 26.00 credits (SD-01)  
**Actual incremental consumption at start:** 0.00 credits (Actual)  
**Remaining Milestone 2 allowance:** 26.00 credits (Allowance, 26.00 − 0.00)  
**Usage-panel allowance:** 10.00 credits (Allowance for two unsaved design-document regeneration attempts; not actual usage)  
**Conservative remaining project budget:** 118.80 credits (Allowance, 200.00 − (71.20 + 10.00))  
**Estimated cost to complete Milestone 2:** 10.00 credits (Estimate, reduced scope)  
**Estimated cost to complete the planned remaining implementation:** 126.42 credits at the unchanged SD-01 ceilings (Estimate; this exceeds the conservative remaining budget and requires reforecast before later milestones)  
**Locked Unallocated_Contingency:** 5.00 credits (Reserved; not available without another Scope_Decision)

## Milestone 2 checkpoint: Visual environment

**Checkpoint:** 2.5 Milestone 2 review  
**Status:** Complete; stopped for user review before Milestone 3.  
**Ending cumulative reading:** 74.84 credits (Actual, supplied from the Kiro usage panel)  

### Credit record

| Field | Value | Kind | Calculation / note |
|---|---:|---|---|
| Starting cumulative reading | 71.20 | Actual | Milestone 2 starting reading |
| Ending cumulative reading | 74.84 | Actual | Ending Kiro usage-panel reading |
| Actual incremental Milestone 2 consumption | 3.64 | Actual | 74.84 − 71.20 |
| Milestone 2 ceiling | 26.00 | SD-01 | Visual environment maximum |
| Remaining Milestone 2 allowance | 22.36 | Allowance | 26.00 − 3.64 |
| Usage-panel allowance | 10.00 | Allowance | Two unsaved design-document regeneration attempts; not actual usage |
| Conservative remaining project budget | 115.16 | Allowance | 200.00 − (74.84 + 10.00) |
| Estimated cost to complete Milestone 2 | 0.00 | Estimate | Required reduced-scope implementation and tests are complete |
| Estimated cost to complete the planned remaining implementation | 100.42 | Estimate | Milestone 3–6 ceilings: 38.00 + 26.00 + 22.00 + 14.42; excludes locked contingency |
| Locked Unallocated_Contingency | 5.00 | Reserved | Not available without another Scope_Decision |

### Automated test record

Command run from the repository root:

```text
node --test && node --check js/main.js && node --check js/scene/capability.js && node --check js/scene/scene.js && node --check js/scene/starfield.js && node --check js/scene/nebula.js && node --check js/scene/planet.js && node --check js/scene/ship.js
```

Result: 3 tests passed, 0 failed; all listed JavaScript syntax checks passed. `git diff --check` also passed.

### User browser checks

| Check | Result |
|---|---|
| Opening screen visible within 3 seconds | Pass |
| WebGL disabled shows CSS fallback and usable controls | Pass |
| Reduced-motion mode shows a static scene | Pass |
| No horizontal scroll at 320 CSS pixels | Pass |
| No horizontal scroll at 768 CSS pixels | Pass |
| No horizontal scroll at 1440 CSS pixels | Pass |

The reduced-scope visual environment is complete. Milestone 3 remains stopped for user review. No contingency was released.
