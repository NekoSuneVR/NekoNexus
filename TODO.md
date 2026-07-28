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

**Status:** first implementation pass done on `dev` (not yet build-verified —
this sandbox has no .NET/MSBuild toolchain, so it's only been checked by
careful manual cross-referencing against the actual SDK/shim source, not by
compiling). Needs a real build + an in-game playtest before it's trustworthy.

Implementation summary:

- `GamePeer.Bot.cs` (new): `GamePeer.CreateBot(name, xp)` factory - a bot is a
  real `GamePeer` constructed with a synthetic `InitRequest` (no live socket,
  so all network sends are safe no-ops) and a fake `Member`/`AuthToken`.
  Required widening `Photon.SocketServer.Shim`'s `InitRequest` with a new
  public constructor (`shims/Photon.SocketServer.Shim/SocketServer.cs`) since
  the existing one is internal to that assembly.
- `BaseGameRoom.Bots.cs` (new): bot population scaling (`SyncBotPopulation`,
  `AddBot`/`RemoveBot`, mirroring the exact `JoinGame`/`Leave` list-mutate +
  raise-event pattern so every per-state handler runs unchanged for bots) and
  a nested `BotBrain` FSM (patrol via `SpawnPointManager` waypoints, engage
  the nearest valid enemy with a distance-based hit-chance model, self-driven
  respawn). Random per-bot loadout drawn from the room's real `ShopManager`
  catalog (1-3 random ranged weapons + melee + gear).
- `BaseGameRoom.cs`: hooked `SyncBotPopulation()` into `JoinGame`/`Leave` (the
  "kick 1 bot per joining human" / "backfill on human leave" behavior),
  `RemoveAllBots()` into `Reset()` (bots don't persist across rounds), and
  `UpdateBots()` into the tick loop. `PreparePlayer` skips the real-webservice
  loadout fetch for bots.
- `AfterRoundState.cs`: bots are excluded from XP/points persistence and
  match-history recording (no real account to write to), but still show up
  in the in-room MVP/score display.
- `ApplicationConfiguration.cs` + both `NekoNexus.Realtime.yml` configs: new
  `GameplaySettings.BotsEnabled` / `BotFillTarget` (default 6) / `MaxBots`
  (default 5) - `BotFillTarget - humanCount`, clamped to `[0, MaxBots]`,
  reproduces the requested 1→5, 2→4, 3→3... curve exactly.

Known gaps / follow-ups:

- Not build-verified (see above) - run a real MSBuild/dotnet build before
  trusting this, then playtest bot behavior in an actual match.
- Bot movement doesn't set `PlayerMovement.MovementState` (animation state
  bits are unknown without decompiling the client) - bots will slide rather
  than visibly run/strafe.
- No line-of-sight/cover check - bots can "see" and shoot through thin
  geometry within engage range.
- `EngageRange`/`MoveSpeed`/hit-chance constants in `BotBrain` are estimates,
  not tuned against real weapon/map scale - expect a balance pass.
