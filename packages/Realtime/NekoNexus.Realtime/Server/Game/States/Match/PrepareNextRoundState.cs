using NekoNexus.Realtime.Core;
using System.Linq;
using System.Threading.Tasks;
using UberStrike.Core.Models;
using UberStrike.Core.Types;
using static NekoNexus.Realtime.Server.Game.BaseGameRoom;

namespace NekoNexus.Realtime.Server.Game {
	internal class PrepareNextRoundState : BaseMatchState {
		private Countdown MatchStartCountdown;

		public PrepareNextRoundState(BaseGameRoom room) : base(room) { }

		public override void OnEnter() {
			Room.PlayerJoined += OnPlayerJoined;
			Room.PlayerLeft += OnPlayerLeft;

			Room.HasRoundEnded = false;
			Room.RoundNumber++;

			Room.PowerUpManager.RespawnItems();
			Room.SpawnPointManager.Reset();

			foreach (var player in Room.Players) {
				player.Actor.PreviousSpawnPoints.Clear();

				bool wasSpectator = player.Actor.ActorInfo.IsSpectator;

				Room.PreparePlayer(player);
				Room.SpawnPlayer(player, wasSpectator);

				player.State.SetState(PlayerStateId.PrepareForMatch);

				if (Room.MetaData.GameMode == GameModeType.DeathMatch) {
					short killsRemaining = (short)Room.MetaData.KillLimit;

					Room.GetCurrentScore(out killsRemaining, out _, out _);

					player.GameEventSender.SendKillsRemaining(killsRemaining, 0);
				} else {
					Room.GetCurrentScore(out _, out short blueTeamScore, out short redTeamScore);

					player.GameEventSender.SendUpdateRoundScore(Room.RoundNumber, blueTeamScore, redTeamScore);
				}
			}

			Task t = Task.Run(async () => {
				await Task.Delay(500);

				MatchStartCountdown = new Countdown(Room.Loop, GameServerApplication.Instance.Configuration.GameplaySettings.MatchCountdownTime, 0);
				MatchStartCountdown.Counted += OnCountdownCounted;
				MatchStartCountdown.Completed += OnCountdownCompleted;

				MatchStartCountdown.Restart();
			});

			GameServerApplication.Instance.SocketClient?.SendSync(WebSocket.PacketType.RoundStarted, Room.MetaData);
		}

		public override void OnExit() {
			Room.PlayerJoined -= OnPlayerJoined;
			Room.PlayerLeft -= OnPlayerLeft;
		}

		public override void OnResume() { }

		public override void OnUpdate() {
			MatchStartCountdown?.Tick();
		}



		#region Handlers
		private void OnCountdownCounted(int count) {
			foreach (var peer in Room.Players) {
				peer.GameEventSender.SendMatchStartCountdown((byte)count);
			}
		}

		private void OnCountdownCompleted() {
			Room.State.SetState(GameStateId.MatchRunning);
		}

		private void OnPlayerJoined(object sender, PlayerJoinedEventArgs args) {
			args.Player.Actor.PreviousSpawnPoints.Clear();


			Room.PreparePlayer(args.Player);
			Room.SpawnPlayer(args.Player, true);

			args.Player.GameEventSender.SendWaitingForPlayers();
			args.Player.State.SetState(PlayerStateId.PrepareForMatch);
		}

		private void OnPlayerLeft(object sender, PlayerLeftEventArgs args) {
			if (!Room.CanStartMatch) {
				Log.Info($"{args.Player.Actor?.Name}({args.Player.Actor?.Cmid}) leaving during PrepareNextRound dropped CanStartMatch to false " +
					$"(blue={Room.Players.Count(p => p.Actor.Team == TeamID.BLUE)}, red={Room.Players.Count(p => p.Actor.Team == TeamID.RED)}, " +
					$"total={Room.Players.Count}) - stopping the match-start countdown.");
				MatchStartCountdown?.Stop();
				//Room.State.SetState(GameStateId.EndOfMatch);
			}
		}
		#endregion
	}
}
