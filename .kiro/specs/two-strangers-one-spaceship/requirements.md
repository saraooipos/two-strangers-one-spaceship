# Requirements Document

## Introduction

**TWO STRANGERS, ONE SPACESHIP** is an asynchronous, remote, cooperative browser adventure for two people. Tagline: *"Two people. One questionable spaceship. An alarming number of bad decisions."*

One player creates a private room as the Captain and shares an invitation URL. A second player opens the URL and becomes the Co-Pilot. Over five short missions, both players receive the same scenario, secretly choose one of four decisions, and see both choices revealed together. A sarcastic Ship's AI comments on the outcome, and the game saves a shared Ship's Log, collectibles, and a final Adventure Journal.

The tone is playful, witty, mischievous and occasionally sarcastic. It is warm without being excessively romantic. It is entertaining, not a personality questionnaire.

The visual style is premium cinematic sci-fi. Usability always wins over visual complexity.

The build is spec-driven and budget-capped at 200 Kiro credits. Features are tagged P0, P1 or P2 (see Priority Classification).

## Glossary

- **Game**: The complete TWO STRANGERS, ONE SPACESHIP browser application, including front end and Supabase back end.
- **Captain**: Player 1. The player who creates the Room.
- **Co-Pilot**: Player 2. The player who joins the Room through the Invite_Token.
- **Player**: The Captain or the Co-Pilot.
- **Room**: A private game session that holds up to two Players and one shared progress record. A Room is in the waiting state while only the Captain has joined and becomes active when the Co-Pilot joins.
- **Invite_Token**: An unguessable random string in the invitation URL that lets one second Player join a Room.
- **Anonymous_Session**: A Supabase anonymous authentication session that identifies a Player without email or password.
- **Mission**: One of the five story chapters. Each has an introduction, four possible Decisions, a Reveal and a consequence.
- **Decision**: The one option a Player secretly picks in a Mission.
- **Reveal**: The server-controlled moment when both Decisions become visible to both Players.
- **Ships_AI**: The deterministic JavaScript personality engine that produces sarcastic commentary from templates and conditional logic, with no external AI service.
- **Ships_Log**: The persistent shared record of missions, Decisions, consequences, jokes, secret messages, aliens and collectibles.
- **Inside_Joke**: A short custom text a Player adds to the Ships_Log for later reference.
- **Secret_Message**: A short text one Player leaves for the other that stays hidden until a defined future Mission event.
- **Alien**: A shared character created by both Players from physical traits (Captain) and personality traits (Co-Pilot).
- **Collectible**: A named item added to the shared inventory by a Mission outcome.
- **Easter_Egg**: A hidden surprise message that is triggered by a specific past Decision, Inside_Joke or Collectible.
- **Adventure_Journal**: The end-of-game summary of the whole adventure.
- **RLS**: Supabase Row Level Security, the database access policies that enforce who can read and write each row.
- **Realtime**: Supabase Realtime subscriptions used to push room updates to clients.
- **Polling_Fallback**: Periodic reading of Room state used when Realtime is unavailable.
- **Public_Anon_Key**: The Supabase public client key. It is the only Supabase credential allowed in front-end code.
- **Service_Role_Key**: The Supabase privileged key. It must never appear in front-end code or the repository.
- **Reduced_Motion_Mode**: Presentation used when the browser reports a reduced-motion preference.
- **Fallback_Presentation**: A static styled scene shown when animated 3D rendering is unavailable or fails.
- **Credit**: One Kiro credit. The unit of project spending.
- **Milestone**: A delivery stage with a Credit ceiling.
- **Unallocated_Contingency**: A reserved 5 Credits within the 200-Credit total that is not part of any Milestone ceiling and cannot be spent without a recorded Scope_Decision.
- **Scope_Decision**: A recorded decision to simplify, defer or drop a feature.
- **Project_Record**: The record of Milestone spending, Scope_Decisions and test results.
- **P0 / P1 / P2**: Priority levels defined in Priority Classification.

## Priority Classification

| Priority | Meaning | Features |
| --- | --- | --- |
| P0 | Must-have for the initial build | Remote rooms with invite URL and Captain/Co-Pilot roles; Anonymous_Sessions; private simultaneous Decisions with RLS; simultaneous Reveal; shared persisted progress with refresh and return; five Missions with four Decisions each; deterministic Ships_AI commentary; basic Ships_Log saving; Collectibles saved; Adventure_Journal generation; responsive desktop and mobile; GitHub Pages deployment; security and error handling; visual opening and animated galaxy and planets |
| P1 | Should-have. Built only if budget allows after all P0 items are verified | Alien creator; custom Inside_Jokes; Secret_Messages; Easter_Eggs referencing past Decisions; Adventure_Journal export or shareable summary; Realtime with polished Polling_Fallback |
| P2 | Excluded from the initial build | See Out of Scope |

Each requirement below carries a priority tag. Criteria that differ from their requirement are tagged individually.

## Requirements

### Requirement 1: Product identity and tone [P0]

**User Story:** As a player, I want a funny and memorable space adventure, so that playing with a friend feels like a shared story rather than a quiz.

#### Acceptance Criteria

1. THE Game SHALL display the title "TWO STRANGERS, ONE SPACESHIP" and the tagline "Two people. One questionable spaceship. An alarming number of bad decisions." on the opening screen.
2. THE Game SHALL write all story, Ships_AI and interface text in a playful, witty and mildly sarcastic tone without romantic or explicit content.
3. THE Game SHALL present Mission questions as story situations with comedic consequences and SHALL NOT present them as personality-test questions.

### Requirement 2: Cinematic visual design [P0]

**User Story:** As a first-time player, I want the game to look impressive immediately, so that I am drawn into the adventure.

#### Acceptance Criteria

1. WHEN the opening screen loads on a Baseline connection, THE Game SHALL show the title, tagline, a start action and an animated galaxy background within 3 seconds.
2. THE Game SHALL use a midnight blue and deep purple base palette with electric blue and turquoise highlights, glassmorphism panels, and animated stars, nebulae and subtle particles.
3. THE Game SHALL show a 3D spaceship and slowly rotating planets, rendered with Three.js, in the opening screen and Mission scenes.
4. THE Game SHALL animate user interface transitions with CSS and SHALL complete each scene transition within 1 second.
5. WHILE Reduced_Motion_Mode is active, THE Game SHALL replace continuous motion with a static composition or transitions no longer than 1 second.
6. IF Three.js rendering fails or WebGL is unavailable, THEN THE Game SHALL show the Fallback_Presentation and keep every Decision control and all text usable.
7. WHILE a scene animates, THE Game SHALL keep Decision controls responsive to input within 200 milliseconds.
8. THE Game SHALL use no custom shaders and no physics engine unless a Scope_Decision records that the feature needs one.
9. [P1] WHERE the budget allows, THE Game SHALL give each of the five Missions a distinct planetary palette.

### Requirement 3: Remote room creation and joining [P0]

**User Story:** As a Captain, I want to create a private room and send a link, so that a friend on another device can join me.

#### Acceptance Criteria

1. WHEN a visitor activates the create-room action, THE Game SHALL create an Anonymous_Session, create a Room, assign the visitor the Captain role and show a unique invitation URL within 3 seconds.
2. THE Game SHALL generate each Invite_Token from at least 128 bits of randomness.
3. WHEN a visitor opens a valid invitation URL for a Room that has one Player, THE Game SHALL create an Anonymous_Session for the visitor and assign the Co-Pilot role within 3 seconds.
4. WHILE the Room has only the Captain, THE Game SHALL show the Captain a waiting state with the invitation URL and a copy action.
5. WHEN the Co-Pilot joins, THE Game SHALL update the Captain's screen within 5 seconds to show that both Players are present.
6. THE Game SHALL not require an email address, password or registration form.
7. THE Game SHALL show each Player a connection status of connected, reconnecting or offline.

### Requirement 4: Persistent shared progress and return [P0]

**User Story:** As a player, I want to refresh or come back later and continue where we stopped, so that we can play at different times.

#### Acceptance Criteria

1. THE Game SHALL store the Room's current Mission, submission status and history in Supabase after each state change.
2. THE Game SHALL store the Anonymous_Session identifier in the browser so that the Player is recognised on return.
3. WHEN a Player refreshes the browser or returns to the Room URL on the same device, THE Game SHALL restore the Player's role and the current Mission within 3 seconds.
4. WHEN either Player changes shared state, THE Game SHALL show the change on the other Player's device within 5 seconds.
5. WHILE one Player has submitted a Decision and the other has not, THE Game SHALL show the waiting Player a message naming the other role as pending and showing no content of the other Decision.
6. WHERE Realtime is unavailable, THE Game SHALL fall back to Polling_Fallback at intervals of 5 seconds or less.
7. [P1] WHERE Realtime is available, THE Game SHALL use Realtime subscriptions in preference to Polling_Fallback.

### Requirement 5: Secret simultaneous decisions [P0]

**User Story:** As a player, I want to choose without seeing my partner's answer, so that the reveal is a real surprise.

#### Acceptance Criteria

1. WHEN a Mission starts, THE Game SHALL show both Players the same narrative introduction and the same four Decision options.
2. WHEN a Player selects an option and confirms, THE Game SHALL save that Decision as private to that Player and show "submitted" to that Player.
3. WHILE only one Decision has been submitted, THE Game SHALL not expose the submitted option to the other Player through the interface or through any database query.
4. WHEN both Decisions have been submitted, THE Game SHALL perform the Reveal on the server and show both Decisions to both Players within 3 seconds, and THE Game SHALL NOT perform a Reveal while the Room is in the waiting state.
5. WHEN the Reveal occurs, THE Game SHALL show a consequence narrative that depends on the combination of both Decisions, plus a Ships_AI comment.
6. WHEN the Reveal occurs, THE Game SHALL append the Mission result to the Ships_Log.
7. IF a Player submits a second Decision for the same Mission, THEN THE Game SHALL keep the first Decision and show a message that the Decision is already locked.
8. IF a Player disconnects after submitting, THEN THE Game SHALL keep the stored Decision and restore the submitted state on return.

### Requirement 6: Five missions [P0]

**User Story:** As a player, I want five varied missions, so that the adventure has a clear arc and an ending.

#### Acceptance Criteria

1. THE Game SHALL provide exactly five Missions in this order: 01 FIRST CONTACT, 02 LOST IN TRANSLATION, 03 THE GREAT SPACE HEIST, 04 THE MEMORY NEBULA, 05 DESTINATION UNKNOWN.
2. THE Game SHALL give each Mission a narrative introduction, exactly four Decision options, a consequence for each pair of Decisions, a Ships_AI comment and a Ships_Log update.
3. THE Game SHALL write FIRST CONTACT around discovering the spaceship and establishing the Captain and Co-Pilot dynamic.
4. THE Game SHALL write LOST IN TRANSLATION around an alien civilisation and an unexpected negotiation.
5. THE Game SHALL write THE GREAT SPACE HEIST around a stolen valuable that the Players cooperate to retrieve.
6. THE Game SHALL write THE MEMORY NEBULA around mysterious discoveries and light questions about preferences, experiences and hypothetical futures.
7. WHEN Mission 05 resolves, THE Game SHALL choose one of the available endings using the Decisions and Collectibles from earlier Missions.
8. WHEN a Mission is revealed, THE Game SHALL show the current Mission number out of five.
9. WHEN Mission 05 is revealed, THE Game SHALL offer the Adventure_Journal.

### Requirement 7: Ship's AI commentary [P0]

**User Story:** As a player, I want the spaceship to react with wit to what we do, so that the game feels alive.

#### Acceptance Criteria

1. THE Ships_AI SHALL generate commentary in client-side JavaScript from templates and conditional logic, without any external AI or paid API call.
2. WHEN a Mission is revealed, THE Ships_AI SHALL produce at least one comment that refers to the specific Decisions of that Mission.
3. WHEN the Ships_Log contains at least one earlier Mission, THE Ships_AI SHALL produce at least one comment that refers to an earlier Decision, incident, tendency or running joke.
4. THE Ships_AI SHALL compare the Captain's and Co-Pilot's tendencies in at least one comment per game after Mission 02.
5. THE Ships_AI SHALL provide at least three distinct templates for each Mission outcome category and SHALL NOT repeat the same template within one Room.
6. WHEN the same Decision pattern recurs, THE Ships_AI SHALL produce a recurring-joke comment, for example "Captain, I have reviewed your previous decisions. I would like to formally request a different Captain."
7. THE Ships_AI SHALL produce the same comment for the same Room history, so that both Players see identical text.

### Requirement 8: Ship's Log [P0 basic, P1 extended]

**User Story:** As a player, I want the game to remember what happened, so that later moments can call back to earlier ones.

#### Acceptance Criteria

1. [P0] WHEN a Mission is revealed, THE Game SHALL save the Mission, both Decisions, the consequence and the Ships_AI comment to the Ships_Log.
2. [P0] THE Game SHALL let either Player open the Ships_Log and view all saved entries at any time after the first Reveal.
3. [P1] WHEN a Player submits an Inside_Joke of 1 to 140 characters, THE Game SHALL save it to the Ships_Log and make it available to the Ships_AI.
4. [P1] WHEN a Player submits a Secret_Message of 1 to 280 characters, THE Game SHALL store the message hidden from the other Player until its scheduled future Mission event.
5. [P1] WHEN the scheduled Mission event is reached, THE Game SHALL reveal the Secret_Message to the other Player and add it to the Ships_Log.
6. [P1] THE Game SHALL list discovered Aliens and Collectibles in the Ships_Log.

### Requirement 9: Alien creator [P1]

**User Story:** As a player, I want to build an alien with my partner, so that we share a silly character.

#### Acceptance Criteria

1. WHEN the alien creation step starts, THE Game SHALL let the Captain choose physical characteristics from predefined options.
2. WHEN the alien creation step starts, THE Game SHALL let the Co-Pilot choose personality characteristics from predefined options.
3. WHEN both Players have submitted, THE Game SHALL generate from predefined combinations and templates an appearance description, a name, a personality, a special ability, a favourite food and a humorous background story.
4. WHEN the Alien is generated, THE Game SHALL save it to the Ships_Log and show it to both Players.
5. THE Game SHALL generate the Alien without calling an external AI service.

### Requirement 10: Collectibles and Easter eggs [P0 Collectibles, P1 Easter eggs]

**User Story:** As a player, I want to collect odd objects and find surprises, so that replaying and exploring feel rewarding.

#### Acceptance Criteria

1. [P0] WHEN a Mission outcome grants a Collectible, THE Game SHALL add it to the shared inventory and save it to the Room.
2. [P0] THE Game SHALL provide at least six Collectibles, including Emergency Chocolate Supply, World's Most Useless Compass, Broken Navigation System, The Last Remaining Brain Cell, Suspicious Alien Souvenir and Golden Ticket to Somewhere.
3. [P0] THE Game SHALL let either Player view the shared inventory.
4. [P1] WHEN a past Decision, Inside_Joke or Collectible matches an Easter_Egg trigger, THE Game SHALL show the Easter_Egg surprise message.
5. [P1] THE Game SHALL provide at least five Easter_Eggs, with at least two that refer to previous Decisions or Inside_Jokes.

### Requirement 11: Adventure journal [P0 generation, P1 export]

**User Story:** As a player, I want a final keepsake of our adventure, so that we can remember and share it.

#### Acceptance Criteria

1. [P0] WHEN Mission 05 is revealed, THE Game SHALL generate an Adventure_Journal showing the Mission history, both Players' Decisions, Mission summaries, Collectibles, the final destination and the overall outcome.
2. [P1] WHERE Inside_Jokes, Aliens or revealed Secret_Messages exist, THE Adventure_Journal SHALL include them.
3. [P0] WHEN either Player returns to a completed Room, THE Game SHALL show the saved Adventure_Journal.
4. [P1] WHEN a Player activates the export action, THE Game SHALL produce a shareable summary as text or a downloadable file within 5 seconds.

### Requirement 12: Responsive and accessible interface [P0]

**User Story:** As a player on a phone or a laptop, I want the game to be comfortable to use, so that I can play wherever I am.

#### Acceptance Criteria

1. THE Game SHALL display story text, Decision options, submission status and the primary action without horizontal scrolling at Viewport widths of 320, 768 and 1440 CSS pixels.
2. THE Game SHALL size every interactive control at least 44 by 44 CSS pixels.
3. WHEN a keyboard user navigates, THE Game SHALL show a visible focus state and follow a logical focus order.
4. THE Game SHALL keep body text contrast at a ratio of at least 4.5 to 1 against its panel background.
5. IF content does not fit the Viewport, THEN THE Game SHALL reflow the content before shrinking the control size.

### Requirement 13: Technical foundation and deployment [P0]

**User Story:** As the project owner, I want a small and maintainable stack, so that the game is cheap to build and host.

#### Acceptance Criteria

1. THE Game SHALL be built with HTML, CSS, vanilla JavaScript and Three.js, with no other runtime dependency except the Supabase client library.
2. THE Game SHALL be deployable as static files through GitHub Pages and SHALL work from the published URL.
3. THE Game SHALL use Supabase for the database, Anonymous_Session authentication and, where practical, Realtime.
4. THE Game SHALL use a small schema with these entities: Rooms, Players, Missions, Decisions, Messages, Ships_Log entries and Collectibles, where Ships_Log entries hold completed Missions, Inside_Jokes, discovered Aliens and revealed Secret_Messages, and Messages stores Secret_Messages.
5. THE Game SHALL read Supabase credentials from a configuration file that is listed in `.gitignore`, and the repository SHALL include a committed example configuration file with placeholder values.
6. THE project documentation SHALL include step-by-step instructions to create the Supabase project, enable anonymous sign-in, apply the schema and policies, and configure the local file and GitHub Pages.
7. THE Game SHALL call no external LLM API and no paid service.

### Requirement 14: Server-enforced privacy and security [P0]

**User Story:** As a player, I want my unrevealed answer to stay secret even from a tech-savvy partner, so that the game is fair.

#### Acceptance Criteria

1. THE Game SHALL enable RLS on every table.
2. THE Game SHALL allow a Player to read and write Room data only when that Player's Anonymous_Session is a member of the Room.
3. WHILE a Mission's Reveal has not occurred, THE database SHALL return to a Player only that Player's own Decision for that Mission, including through direct queries with the Public_Anon_Key.
4. THE database SHALL perform the Reveal state change through a server-side function or policy condition that exposes both Decisions only after the Room has exactly two Players and both have submitted.
5. THE database SHALL reject a second Decision from the same Player for the same Mission.
6. THE database SHALL reject a third Player from joining a Room that already has two Players.
7. THE Game SHALL ship only the Public_Anon_Key in front-end code, and the Service_Role_Key SHALL appear nowhere in the repository.
8. THE database SHALL validate Inside_Joke and Secret_Message length on the server, rejecting text over 140 and 280 characters respectively.
9. THE Game SHALL render all Player-entered text as plain text so that HTML markup is never executed.
10. WHERE the platform supports it, THE database SHALL limit each Session to 60 write requests per minute and to 1 KB per text field.

### Requirement 15: Error handling [P0]

**User Story:** As a player, I want clear messages when something goes wrong, so that I know what to do next.

#### Acceptance Criteria

1. IF a visitor opens an invitation URL with an invalid or unknown Invite_Token, THEN THE Game SHALL show an "invalid invitation" message with an action to create a new Room.
2. IF a visitor opens an invitation URL for a Room that already has two Players and the visitor is not a member, THEN THE Game SHALL show a "room is full" message and reveal no Room content.
3. IF a visitor requests a Room without valid membership, THEN THE Game SHALL deny access and show a message that contains no Room data.
4. IF the Anonymous_Session has expired, THEN THE Game SHALL attempt one silent session refresh and, on failure, show a message explaining that the Player must rejoin through the invitation URL.
5. IF a database request fails, THEN THE Game SHALL show a retry action within 5 seconds and keep the Player's unsent selection on screen.
6. WHILE the other Player has not submitted, THE Game SHALL show a waiting state and SHALL NOT advance the Mission.
7. WHILE the other Player's connection is offline, THE Game SHALL show that the Player is disconnected and keep the Mission state intact.
8. WHEN a Player refreshes during a Mission, THE Game SHALL restore the submitted or unsubmitted state of that Player's Decision.

### Requirement 16: Spec-driven development process [P0]

**User Story:** As the project owner, I want controlled delivery, so that credits are not wasted on rework.

#### Acceptance Criteria

1. THE project SHALL begin no implementation until the requirements, design and tasks are approved.
2. THE project SHALL implement one Milestone at a time.
3. WHEN a Milestone starts, THE project SHALL report the planned changes, affected files, complexity, risks and remaining Credit budget before implementation.
4. WHEN a Milestone implementation finishes, THE project SHALL run the relevant tests and report the results.
5. THE project SHALL not rebuild a working feature unless a recorded failing test or Scope_Decision requires it.
6. THE project SHALL reserve the 5-Credit Unallocated_Contingency as part of the 200-Credit total and not as an additional spending allowance, SHALL NOT permit any Milestone to spend it, SHALL release it to a Milestone only through a recorded Scope_Decision, and SHALL keep total project spending at no more than 200 Credits.

### Requirement 17: Credit budget governance [P0]

**User Story:** As the project owner, I want a hard spending limit, so that the project finishes within 200 credits.

#### Acceptance Criteria

1. THE project SHALL cap total spending at 200 Credits using Auto model selection, and no document or plan SHALL recommend exceeding 200 Credits.
2. THE project SHALL apply Scope_Decision SD-01 (Budget re-baseline) as the authoritative budget, superseding the original Milestone allocation (Specifications 10, Project foundation 20, Visual environment 45, Remote backend 45, Game mechanics and personalisation 35, Testing and security 22, Final polish 18) and the interim remaining allocation of 169 Credits, and SHALL treat the SD-01 Milestone ceilings as maximums and not targets.
3. WHEN a Milestone completes, THE Project_Record SHALL show its actual spend, remaining ceiling and remaining project total.
4. IF a forecast shows a Milestone ceiling or the 200-Credit total will be exceeded, THEN THE project SHALL record a Scope_Decision that first simplifies or drops P1 features, then reduces P0 polish, and SHALL not expand the budget.
5. THE project SHALL avoid repeated full-project rewrites, unnecessary dependencies, repeated speculative analysis, unnecessary custom shaders, complex physics, external LLM integrations and unnecessary backend infrastructure.
6. WHILE P0 items remain unverified, THE project SHALL not spend Credits on P1 features.
7. THE project SHALL record SD-01 with these figures: absolute project cap 200 Credits; 44.58 Credits actual consumption read from the Kiro usage panel; a 10-Credit allowance for two unsaved design.md regeneration attempts, which is an allowance and not confirmed actual usage; a conservative budget basis of 54.58 Credits; a remaining budget of 145.42 Credits; a planned implementation ceiling of 140.42 Credits; and a locked 5-Credit Unallocated_Contingency.
8. THE project SHALL apply these SD-01 Milestone ceilings: Project foundation 14, Visual environment 26, Remote backend 38, Game mechanics and personalisation 26, Testing and security 22 and Final polish 14.42, so that the Milestone ceilings total 140.42, the Unallocated_Contingency is 5, the remaining budget is 145.42 and the conservative budget basis plus the remaining budget equals exactly 200.
9. THE project SHALL release the 5-Credit Unallocated_Contingency only through a further recorded Scope_Decision, and SHALL NOT assume any Credits beyond the SD-01 remaining budget of 145.42, including any part of the 10-Credit allowance later found unused, unless a further recorded Scope_Decision assigns them.
10. THE project SHALL report actual consumption, allowances and estimates separately in the Project_Record and SHALL NOT report an allowance or estimate as actual consumption.
11. Credit tracking is defined in Requirement 16.

### Requirement 18: Release acceptance [P0]

**User Story:** As the project owner, I want a clear release gate, so that I know when the game is done.

#### Acceptance Criteria

1. THE Game SHALL be eligible for release only when every criterion below passes within the 200-Credit maximum.
2. [P0] Two Players SHALL join one private Room on separate devices.
3. [P0] Both Players SHALL access the same Mission.
4. [P0] Decisions SHALL remain private until both are submitted.
5. [P0] Both Decisions SHALL be revealed together.
6. [P0] Progress SHALL persist across refreshes and returning sessions.
7. [P0] The spaceship SHALL make contextual comments.
8. [P0] Inside_Jokes and completed Mission entries SHALL be saved to the Ships_Log and viewable by both Players.
9. [P1] The Players SHALL create an Alien together.
10. [P0] Collectibles SHALL be saved.
11. [P0] All five Missions SHALL be completable.
12. [P0] The Adventure_Journal SHALL be generated, and [P1] exportable as a shareable summary.
13. [P0] The Game SHALL work on mobile and desktop at the three required Viewport widths.
14. [P0] The Game SHALL be deployable through GitHub Pages.
15. [P0] Database access policies SHALL protect private Decisions, verified by a direct query test with the Public_Anon_Key.
16. IF a P1 item is dropped for budget, THEN THE project SHALL waive its gate only through a recorded Scope_Decision in the Project_Record.

## Out of Scope / P2 (excluded from initial build)

Future ideas only. None of these are built in the initial release.

- More than five Missions.
- Voice or text chat between Players.
- External LLM or AI APIs.
- Accounts, email login or social login.
- Payments or paid services.
- Multi-room lobbies or matchmaking.
- Custom shaders or complex physics.
- Native mobile apps.
- Analytics.

## Risks and Recommended Simplifications

- **Realtime cost or complexity:** Use Polling_Fallback only (5-second interval) and drop Realtime.
- **Scene cost:** Reuse one planet scene with palette, lighting and camera changes for all Missions.
- **Content volume:** Cap Ships_AI templates at three per outcome category, Easter_Eggs at five, and Collectibles at six.
- **RLS complexity:** Keep the schema to the seven listed entities and perform the Reveal in one server-side function.
- **Low-power devices:** Reduce particle counts and fall back to the Fallback_Presentation.
- **Budget pressure:** Drop in this order: Adventure_Journal export, Easter_Eggs, Secret_Messages, Inside_Jokes, Alien creator, then reduce P0 visual polish.
