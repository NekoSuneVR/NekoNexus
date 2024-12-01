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

export default class PlayerWeaponStatisticsView {
  MeleeTotalSplats: number;
  HandgunTotalSplats: number; // # LEGACY # //
  MachineGunTotalSplats: number;
  ShotgunTotalSplats: number;
  SniperTotalSplats: number;
  SplattergunTotalSplats: number;
  CannonTotalSplats: number;
  LauncherTotalSplats: number;
  MeleeTotalShotsFired: number;
  MeleeTotalShotsHit: number;
  MeleeTotalDamageDone: number;
  HandgunTotalDamageDone: number; // # LEGACY # //
  HandgunTotalShotsFired: number; // # LEGACY # //
  HandgunTotalShotsHit: number; // # LEGACY # //
  MachineGunTotalShotsFired: number;
  MachineGunTotalShotsHit: number;
  MachineGunTotalDamageDone: number;
  ShotgunTotalShotsFired: number;
  ShotgunTotalShotsHit: number;
  ShotgunTotalDamageDone: number;
  SniperTotalShotsFired: number;
  SniperTotalShotsHit: number;
  SniperTotalDamageDone: number;
  SplattergunTotalShotsFired: number;
  SplattergunTotalShotsHit: number;
  SplattergunTotalDamageDone: number;
  CannonTotalShotsFired: number;
  CannonTotalShotsHit: number;
  CannonTotalDamageDone: number;
  LauncherTotalShotsFired: number;
  LauncherTotalShotsHit: number;
  LauncherTotalDamageDone: number;

  constructor(params: Partial<PlayerWeaponStatisticsView> = {}) {
    Object.assign(this, params);
  }

  toString(): string {
    return `[PlayerWeaponStatisticsView: [CannonTotalDamageDone: ${this.CannonTotalDamageDone}][CannonTotalShotsFired: ${this.CannonTotalShotsFired}][CannonTotalShotsHit: ${this.CannonTotalShotsHit}][CannonTotalSplats: ${this.CannonTotalSplats}][HandgunTotalDamageDone: ${this.HandgunTotalDamageDone}][HandgunTotalShotsFired: ${this.HandgunTotalShotsFired}][HandgunTotalShotsHit: ${this.HandgunTotalShotsHit}][HandgunTotalSplats: ${this.HandgunTotalSplats}][LauncherTotalDamageDone: ${this.LauncherTotalDamageDone}][LauncherTotalShotsFired: ${this.LauncherTotalShotsFired}][LauncherTotalShotsHit: ${this.LauncherTotalShotsHit}][LauncherTotalSplats: ${this.LauncherTotalSplats}][MachineGunTotalDamageDone: ${this.MachineGunTotalDamageDone}][MachineGunTotalShotsFired: ${this.MachineGunTotalShotsFired}][MachineGunTotalShotsHit: ${this.MachineGunTotalShotsHit}][MachineGunTotalSplats: ${this.MachineGunTotalSplats}][MeleeTotalDamageDone: ${this.MeleeTotalDamageDone}][MeleeTotalShotsFired: ${this.MeleeTotalShotsFired}][MeleeTotalShotsHit: ${this.MeleeTotalShotsHit}][MeleeTotalSplats: ${this.MeleeTotalSplats}][ShotgunTotalDamageDone: ${this.ShotgunTotalDamageDone}][ShotgunTotalShotsFired: ${this.ShotgunTotalShotsFired}][ShotgunTotalShotsHit: ${this.ShotgunTotalShotsHit}][ShotgunTotalSplats: ${this.ShotgunTotalSplats}][SniperTotalDamageDone: ${this.SniperTotalDamageDone}][SniperTotalShotsFired: ${this.SniperTotalShotsFired}][SniperTotalShotsHit: ${this.SniperTotalShotsHit}][SniperTotalSplats: ${this.SniperTotalSplats}][SplattergunTotalDamageDone: ${this.SplattergunTotalDamageDone}][SplattergunTotalShotsFired: ${this.SplattergunTotalShotsFired}][SplattergunTotalShotsHit: ${this.SplattergunTotalShotsHit}][SplattergunTotalSplats: ${this.SplattergunTotalSplats}]]`;
  }
}
