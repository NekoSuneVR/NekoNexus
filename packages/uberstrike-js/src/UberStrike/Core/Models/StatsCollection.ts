/*
 * Copyright (C) 2017, 2021-2024 Team FESTIVAL
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

export default class StatsCollection {
  Headshots: number;
  Nutshots: number;
  ConsecutiveSnipes: number;
  Xp: number;
  Deaths: number;
  DamageReceived: number;
  ArmorPickedUp: number;
  HealthPickedUp: number;
  MeleeKills: number;
  MeleeShotsFired: number;
  MeleeShotsHit: number;
  MeleeDamageDone: number;
  HandgunKills: number;
  HandgunShotsFired: number;
  HandgunShotsHit: number;
  HandgunDamageDone: number;
  MachineGunKills: number;
  MachineGunShotsFired: number;
  MachineGunShotsHit: number;
  MachineGunDamageDone: number;
  ShotgunSplats: number;
  ShotgunShotsFired: number;
  ShotgunShotsHit: number;
  ShotgunDamageDone: number;
  SniperKills: number;
  SniperShotsFired: number;
  SniperShotsHit: number;
  SniperDamageDone: number;
  SplattergunKills: number;
  SplattergunShotsFired: number;
  SplattergunShotsHit: number;
  SplattergunDamageDone: number;
  CannonKills: number;
  CannonShotsFired: number;
  CannonShotsHit: number;
  CannonDamageDone: number;
  LauncherKills: number;
  LauncherShotsFired: number;
  LauncherShotsHit: number;
  LauncherDamageDone: number;
  Suicides: number;
  Points: number;

  constructor(params: Partial<StatsCollection> = {}) {
    Object.assign(this, params);
  }

  GetKills(): number {
    return (
      this.MeleeKills +
      this.HandgunKills +
      this.MachineGunKills +
      this.ShotgunSplats +
      this.SniperKills +
      this.SplattergunKills +
      this.CannonKills +
      this.LauncherKills -
      this.Suicides
    );
  }

  GetShots(): number {
    return (
      this.MeleeShotsFired +
      this.HandgunShotsFired +
      this.MachineGunShotsFired +
      this.ShotgunShotsFired +
      this.SniperShotsFired +
      this.SplattergunShotsFired +
      this.CannonShotsFired +
      this.LauncherShotsFired
    );
  }

  GetHits(): number {
    return (
      this.MeleeShotsHit +
      this.HandgunShotsHit +
      this.MachineGunShotsHit +
      this.ShotgunShotsHit +
      this.SniperShotsHit +
      this.SplattergunShotsHit +
      this.CannonShotsHit +
      this.LauncherShotsHit
    );
  }

  GetDamageDealt(): number {
    return (
      this.MeleeDamageDone +
      this.HandgunDamageDone +
      this.MachineGunDamageDone +
      this.ShotgunDamageDone +
      this.SniperDamageDone +
      this.SplattergunDamageDone +
      this.CannonDamageDone +
      this.LauncherDamageDone
    );
  }
}
