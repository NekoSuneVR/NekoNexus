using System;
using System.Collections.Generic;
using System.Linq;
using UberStrike.Core.Models;
using UberStrike.Core.Types;

namespace Paradise.Realtime.Server.Game {
	public class GameActorStatistics {
		private GamePeer peer;
		private GameActorInfo actorInfo => peer.Actor.ActorInfo;

		public StatsCollection MatchStatistics { get; private set; } = new StatsCollection();
		public StatsCollection CurrentLifeStatistics { get; private set; } = new StatsCollection();
		public List<StatsCollection> PerLifeStatistics { get; private set; } = new List<StatsCollection>();

		public short Kills => (short)MatchStatistics.GetKills();
		public short Deaths => (short)MatchStatistics.Deaths;
		public short Suicides => (short)MatchStatistics.Suicides;
		public double KillDeathRatio => Kills / Math.Max(1, (int)Deaths);
		public double Accuracy => Math.Min((MatchStatistics.GetHits() / Math.Max(1, MatchStatistics.GetShots())) * 100, 100);

		public GameActorStatistics(GamePeer peer) {
			this.peer = peer;
		}

		public void ResetStatistics() {
			MatchStatistics = new StatsCollection();
			ResetCurrentLifeStatistics(false);
			PerLifeStatistics.Clear();
		}

		public void ResetCurrentLifeStatistics(bool addToPerLifeStatistics = true) {
			if (addToPerLifeStatistics) {
				PerLifeStatistics.Add(CurrentLifeStatistics);
			}

			CurrentLifeStatistics = new StatsCollection();
		}

		public StatsCollection GetBestPerLifeStatistics() {
			return new StatsCollection {
				Headshots = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.Headshots) : 0,
				Nutshots = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.Nutshots) : 0,
				ConsecutiveSnipes = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.ConsecutiveSnipes) : 0,
				Xp = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.Xp) : 0,
				DamageReceived = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.DamageReceived) : 0,
				ArmorPickedUp = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.ArmorPickedUp) : 0,
				HealthPickedUp = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.HealthPickedUp) : 0,
				MeleeKills = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.MeleeKills) : 0,
				MeleeShotsFired = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.MeleeShotsFired) : 0,
				MeleeShotsHit = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.MeleeShotsHit) : 0,
				MeleeDamageDone = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.MeleeDamageDone) : 0,
				HandgunKills = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.HandgunKills) : 0,
				HandgunShotsFired = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.HandgunShotsFired) : 0,
				HandgunShotsHit = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.HandgunShotsHit) : 0,
				HandgunDamageDone = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.HandgunDamageDone) : 0,
				MachineGunKills = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.MachineGunKills) : 0,
				MachineGunShotsFired = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.MachineGunShotsFired) : 0,
				MachineGunShotsHit = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.MachineGunShotsHit) : 0,
				MachineGunDamageDone = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.MachineGunDamageDone) : 0,
				ShotgunSplats = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.ShotgunSplats) : 0,
				ShotgunShotsFired = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.ShotgunShotsFired) : 0,
				ShotgunShotsHit = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.ShotgunShotsHit) : 0,
				ShotgunDamageDone = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.ShotgunDamageDone) : 0,
				SniperKills = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.SniperKills) : 0,
				SniperShotsFired = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.SniperShotsFired) : 0,
				SniperShotsHit = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.SniperShotsHit) : 0,
				SniperDamageDone = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.SniperDamageDone) : 0,
				SplattergunKills = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.SplattergunKills) : 0,
				SplattergunShotsFired = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.SplattergunShotsFired) : 0,
				SplattergunShotsHit = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.SplattergunShotsHit) : 0,
				SplattergunDamageDone = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.SplattergunDamageDone) : 0,
				CannonKills = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.CannonKills) : 0,
				CannonShotsFired = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.CannonShotsFired) : 0,
				CannonShotsHit = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.CannonShotsHit) : 0,
				CannonDamageDone = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.CannonDamageDone) : 0,
				LauncherKills = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.LauncherKills) : 0,
				LauncherShotsFired = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.LauncherShotsFired) : 0,
				LauncherShotsHit = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.LauncherShotsHit) : 0,
				LauncherDamageDone = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.LauncherDamageDone) : 0,

				Deaths = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.Deaths) : 0,
				Suicides = PerLifeStatistics.Any() ? PerLifeStatistics.Max(_ => _.Suicides) : 0
			};
		}

		public void IncreaseHeadshots(int headshots = 1) {
			MatchStatistics.Headshots += headshots;
			CurrentLifeStatistics.Headshots += headshots;
		}

		public void IncreaseNutshots(int nutshots = 1) {
			MatchStatistics.Nutshots += nutshots;
			CurrentLifeStatistics.Nutshots += nutshots;
		}

		public void IncreaseConsecutiveSnipes(int snipes = 1) {
			MatchStatistics.ConsecutiveSnipes += snipes;
			CurrentLifeStatistics.ConsecutiveSnipes += snipes;
		}

		public void IncreaseXp(int xp) {
			MatchStatistics.Xp += xp;
			CurrentLifeStatistics.Xp += xp;
		}

		public void IncreaseDamageReceived(int receivedDamage) {
			MatchStatistics.DamageReceived += receivedDamage;
			CurrentLifeStatistics.DamageReceived += receivedDamage;
		}

		public void IncreaseArmorPickedUp(int armor) {
			MatchStatistics.ArmorPickedUp += armor;
			CurrentLifeStatistics.ArmorPickedUp += armor;
		}

		public void IncreaseHealthPickedUp(int health) {
			MatchStatistics.HealthPickedUp += health;
			CurrentLifeStatistics.HealthPickedUp += health;
		}

		public void IncreaseWeaponKills(UberstrikeItemClass itemClass, BodyPart bodyPart) {
			actorInfo.Kills++;

			switch (bodyPart) {
				case BodyPart.Head:
					IncreaseHeadshots();
					break;
				case BodyPart.Nuts:
					IncreaseNutshots();
					break;
			}

			switch (itemClass) {
				case UberstrikeItemClass.WeaponMelee:
					MatchStatistics.MeleeKills++;
					CurrentLifeStatistics.MeleeKills++;
					break;
				case UberstrikeItemClass.WeaponHandgun:
					MatchStatistics.HandgunKills++;
					CurrentLifeStatistics.HandgunKills++;
					break;
				case UberstrikeItemClass.WeaponMachinegun:
					MatchStatistics.MachineGunKills++;
					CurrentLifeStatistics.MachineGunKills++;
					break;
				case UberstrikeItemClass.WeaponShotgun:
					MatchStatistics.ShotgunSplats++;
					CurrentLifeStatistics.ShotgunSplats++;
					break;
				case UberstrikeItemClass.WeaponSniperRifle:
					MatchStatistics.SniperKills++;
					CurrentLifeStatistics.SniperKills++;
					break;
				case UberstrikeItemClass.WeaponSplattergun:
					MatchStatistics.SplattergunKills++;
					CurrentLifeStatistics.SplattergunKills++;
					break;
				case UberstrikeItemClass.WeaponCannon:
					MatchStatistics.CannonKills++;
					CurrentLifeStatistics.CannonKills++;
					break;
				case UberstrikeItemClass.WeaponLauncher:
					MatchStatistics.LauncherKills++;
					CurrentLifeStatistics.LauncherKills++;
					break;
				default:
					break;
			}
		}

		public void IncreaseWeaponShotsFired(UberstrikeItemClass itemClass, int shots) {
			switch (itemClass) {
				case UberstrikeItemClass.WeaponMelee:
					MatchStatistics.MeleeShotsFired += shots;
					CurrentLifeStatistics.MeleeShotsFired += shots;
					break;
				case UberstrikeItemClass.WeaponHandgun:
					MatchStatistics.HandgunShotsFired += shots;
					CurrentLifeStatistics.HandgunShotsFired += shots;
					break;
				case UberstrikeItemClass.WeaponMachinegun:
					MatchStatistics.MachineGunShotsFired += shots;
					CurrentLifeStatistics.MachineGunShotsFired += shots;
					break;
				case UberstrikeItemClass.WeaponShotgun:
					MatchStatistics.ShotgunShotsFired += shots;
					CurrentLifeStatistics.ShotgunShotsFired += shots;
					break;
				case UberstrikeItemClass.WeaponSniperRifle:
					MatchStatistics.SniperShotsFired += shots;
					CurrentLifeStatistics.SniperShotsFired += shots;
					break;
				case UberstrikeItemClass.WeaponSplattergun:
					MatchStatistics.SplattergunShotsFired += shots;
					CurrentLifeStatistics.SplattergunShotsFired += shots;
					break;
				case UberstrikeItemClass.WeaponCannon:
					MatchStatistics.CannonShotsFired += shots;
					CurrentLifeStatistics.CannonShotsFired += shots;
					break;
				case UberstrikeItemClass.WeaponLauncher:
					MatchStatistics.LauncherShotsFired += shots;
					CurrentLifeStatistics.LauncherShotsFired += shots;
					break;
				default:
					break;
			}
		}

		public void IncreaseWeaponShotsHit(UberstrikeItemClass itemClass, int shots = 1) {
			switch (itemClass) {
				case UberstrikeItemClass.WeaponMelee:
					MatchStatistics.MeleeShotsHit += shots;
					CurrentLifeStatistics.MeleeShotsHit += shots;
					break;
				case UberstrikeItemClass.WeaponHandgun:
					MatchStatistics.HandgunShotsHit += shots;
					CurrentLifeStatistics.HandgunShotsHit += shots;
					break;
				case UberstrikeItemClass.WeaponMachinegun:
					MatchStatistics.MachineGunShotsHit += shots;
					CurrentLifeStatistics.MachineGunShotsHit += shots;
					break;
				case UberstrikeItemClass.WeaponShotgun:
					MatchStatistics.ShotgunShotsHit += shots;
					CurrentLifeStatistics.ShotgunShotsHit += shots;
					break;
				case UberstrikeItemClass.WeaponSniperRifle:
					MatchStatistics.SniperShotsHit += shots;
					CurrentLifeStatistics.SniperShotsHit += shots;
					break;
				case UberstrikeItemClass.WeaponSplattergun:
					MatchStatistics.SplattergunShotsHit += shots;
					CurrentLifeStatistics.SplattergunShotsHit += shots;
					break;
				case UberstrikeItemClass.WeaponCannon:
					MatchStatistics.CannonShotsHit += shots;
					CurrentLifeStatistics.CannonShotsHit += shots;
					break;
				case UberstrikeItemClass.WeaponLauncher:
					MatchStatistics.LauncherShotsHit += shots;
					CurrentLifeStatistics.LauncherShotsHit += shots;
					break;
				default:
					break;
			}
		}

		public void IncreaseWeaponDamageDone(UberstrikeItemClass itemClass, int damage) {
			switch (itemClass) {
				case UberstrikeItemClass.WeaponMelee:
					MatchStatistics.MeleeDamageDone += damage;
					CurrentLifeStatistics.MeleeDamageDone += damage;
					break;
				case UberstrikeItemClass.WeaponHandgun:
					MatchStatistics.HandgunDamageDone += damage;
					CurrentLifeStatistics.HandgunDamageDone += damage;
					break;
				case UberstrikeItemClass.WeaponMachinegun:
					MatchStatistics.MachineGunDamageDone += damage;
					CurrentLifeStatistics.MachineGunDamageDone += damage;
					break;
				case UberstrikeItemClass.WeaponShotgun:
					MatchStatistics.ShotgunDamageDone += damage;
					CurrentLifeStatistics.ShotgunDamageDone += damage;
					break;
				case UberstrikeItemClass.WeaponSniperRifle:
					MatchStatistics.SniperDamageDone += damage;
					CurrentLifeStatistics.SniperDamageDone += damage;
					break;
				case UberstrikeItemClass.WeaponSplattergun:
					MatchStatistics.SplattergunDamageDone += damage;
					CurrentLifeStatistics.SplattergunDamageDone += damage;
					break;
				case UberstrikeItemClass.WeaponCannon:
					MatchStatistics.CannonDamageDone += damage;
					CurrentLifeStatistics.CannonDamageDone += damage;
					break;
				case UberstrikeItemClass.WeaponLauncher:
					MatchStatistics.LauncherDamageDone += damage;
					CurrentLifeStatistics.LauncherDamageDone += damage;
					break;
				default:
					break;
			}
		}

		public void IncreaseDeaths() {
			actorInfo.Deaths++;

			MatchStatistics.ConsecutiveSnipes = 0;
			MatchStatistics.Deaths++;

			PerLifeStatistics.Add(CurrentLifeStatistics);
			ResetCurrentLifeStatistics();
		}

		public void IncreaseSuicides() {
			actorInfo.Deaths++;

			MatchStatistics.ConsecutiveSnipes = 0;
			MatchStatistics.Suicides++;

			PerLifeStatistics.Add(CurrentLifeStatistics);
			ResetCurrentLifeStatistics();
		}
	}
}
