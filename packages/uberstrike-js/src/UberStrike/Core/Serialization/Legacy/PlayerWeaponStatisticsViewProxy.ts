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

import { PlayerWeaponStatisticsView } from '@/UberStrike/DataCenter/Common/Entities';
import Int32Proxy from '../Int32Proxy';

export default class PlayerWeaponStatisticsViewProxy {
  static Serialize(stream: number[], instance: PlayerWeaponStatisticsView): void {
    const num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, instance.CannonTotalDamageDone);
      Int32Proxy.Serialize(memoryStream, instance.CannonTotalShotsFired);
      Int32Proxy.Serialize(memoryStream, instance.CannonTotalShotsHit);
      Int32Proxy.Serialize(memoryStream, instance.CannonTotalSplats);
      Int32Proxy.Serialize(memoryStream, instance.HandgunTotalDamageDone);
      Int32Proxy.Serialize(memoryStream, instance.HandgunTotalShotsFired);
      Int32Proxy.Serialize(memoryStream, instance.HandgunTotalShotsHit);
      Int32Proxy.Serialize(memoryStream, instance.HandgunTotalSplats);
      Int32Proxy.Serialize(memoryStream, instance.LauncherTotalDamageDone);
      Int32Proxy.Serialize(memoryStream, instance.LauncherTotalShotsFired);
      Int32Proxy.Serialize(memoryStream, instance.LauncherTotalShotsHit);
      Int32Proxy.Serialize(memoryStream, instance.LauncherTotalSplats);
      Int32Proxy.Serialize(memoryStream, instance.MachineGunTotalDamageDone);
      Int32Proxy.Serialize(memoryStream, instance.MachineGunTotalShotsFired);
      Int32Proxy.Serialize(memoryStream, instance.MachineGunTotalShotsHit);
      Int32Proxy.Serialize(memoryStream, instance.MachineGunTotalSplats);
      Int32Proxy.Serialize(memoryStream, instance.MeleeTotalDamageDone);
      Int32Proxy.Serialize(memoryStream, instance.MeleeTotalShotsFired);
      Int32Proxy.Serialize(memoryStream, instance.MeleeTotalShotsHit);
      Int32Proxy.Serialize(memoryStream, instance.MeleeTotalSplats);
      Int32Proxy.Serialize(memoryStream, instance.ShotgunTotalDamageDone);
      Int32Proxy.Serialize(memoryStream, instance.ShotgunTotalShotsFired);
      Int32Proxy.Serialize(memoryStream, instance.ShotgunTotalShotsHit);
      Int32Proxy.Serialize(memoryStream, instance.ShotgunTotalSplats);
      Int32Proxy.Serialize(memoryStream, instance.SniperTotalDamageDone);
      Int32Proxy.Serialize(memoryStream, instance.SniperTotalShotsFired);
      Int32Proxy.Serialize(memoryStream, instance.SniperTotalShotsHit);
      Int32Proxy.Serialize(memoryStream, instance.SniperTotalSplats);
      Int32Proxy.Serialize(memoryStream, instance.SplattergunTotalDamageDone);
      Int32Proxy.Serialize(memoryStream, instance.SplattergunTotalShotsFired);
      Int32Proxy.Serialize(memoryStream, instance.SplattergunTotalShotsHit);
      Int32Proxy.Serialize(memoryStream, instance.SplattergunTotalSplats);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): PlayerWeaponStatisticsView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let playerWeaponStatisticsView: PlayerWeaponStatisticsView | null = null;
    if (num !== 0) {
      playerWeaponStatisticsView = new PlayerWeaponStatisticsView();
      playerWeaponStatisticsView.CannonTotalDamageDone = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.CannonTotalShotsFired = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.CannonTotalShotsHit = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.CannonTotalSplats = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.HandgunTotalDamageDone = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.HandgunTotalShotsFired = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.HandgunTotalShotsHit = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.HandgunTotalSplats = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.LauncherTotalDamageDone = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.LauncherTotalShotsFired = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.LauncherTotalShotsHit = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.LauncherTotalSplats = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.MachineGunTotalDamageDone = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.MachineGunTotalShotsFired = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.MachineGunTotalShotsHit = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.MachineGunTotalSplats = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.MeleeTotalDamageDone = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.MeleeTotalShotsFired = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.MeleeTotalShotsHit = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.MeleeTotalSplats = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.ShotgunTotalDamageDone = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.ShotgunTotalShotsFired = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.ShotgunTotalShotsHit = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.ShotgunTotalSplats = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.SniperTotalDamageDone = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.SniperTotalShotsFired = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.SniperTotalShotsHit = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.SniperTotalSplats = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.SplattergunTotalDamageDone = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.SplattergunTotalShotsFired = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.SplattergunTotalShotsHit = Int32Proxy.Deserialize(bytes);
      playerWeaponStatisticsView.SplattergunTotalSplats = Int32Proxy.Deserialize(bytes);
    }
    return playerWeaponStatisticsView;
  }
}
