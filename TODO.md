# TODO

## Feature: AI fill bots (auto-scale bots to keep matches populated)

**Goal:** let low-population servers stay playable so people can level up /
practice solo, without bots crowding out real matches once people show up.

**Requested behavior:**

- When a server/match has few or no human players, auto-fill it with AI bots
  so there's always something to play against (leveling up, XP, etc. even
  when no one else is online).
- Bots should feel like real opponents, not aimbots or punching bags:
  - Random class/loadout per bot (mirror whatever class/loadout variety
    human players have).
  - Reasonable-but-fallible aim, movement, cover usage, target switching —
    "smart", not perfect.
  - Wander/patrol behavior when no target is engaged, instead of standing
    still or clumping.
- Bot count scales inversely with human player count, e.g.:
  - 1 human → 5 bots.
  - 2 humans → 4 bots.
  - 3 humans → 3 bots.
  - ... down to 0 bots once the room is "full enough" of humans (exact
    curve/thresholds TBD — needs a design pass).
- When a new human player joins, kick/despawn one bot per joining player
  (not all at once) so the transition from bot-filled to human-filled is
  gradual.
- When a human leaves, backfill with a bot again to maintain the target
  population.
- Needs to be per-match/per-room, not global — different rooms may have
  different human counts at the same time.

**Open questions / design work needed:**

- Where do bots live in the architecture — `NekoNexus.Realtime` (authoritative
  game server) is the right place, since it already owns room state, player
  spawn/despawn, and match simulation.
- Bot AI approach: simple finite-state machine (idle/patrol → engage → seek
  cover → reload) is probably enough for v1; behavior tree only if FSM proves
  too limited.
- Should bots earn/grant XP normally (so leveling still feels legitimate) or
  be flagged so they don't distort leaderboards/economy?
- Bot naming/identity — need placeholder accounts or a dedicated "bot" player
  type distinct from real accounts (avoid polluting the players table /
  leaderboard).
- Config knobs: enable/disable per server, min/max bot count, humans-to-bots
  ratio, difficulty tuning — likely belongs in the server config alongside
  existing gameplay settings.

**Status:** not started — needs design/estimation before implementation.
