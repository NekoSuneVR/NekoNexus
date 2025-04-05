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
import Int32Proxy from './Int32Proxy';

export default class PlayerWeaponStatisticsViewProxy {
  static Serialize(stream: number[], instance: PlayerWeaponStatisticsView): void {
    const memoryStream: number[] = [];
    Int32Proxy.Serialize(memoryStream, instance.CannonTotalDamageDone);
    Int32Proxy.Serialize(memoryStream, instance.CannonTotalShotsFired);
    Int32Proxy.Serialize(memoryStream, instance.CannonTotalShotsHit);
    Int32Proxy.Serialize(memoryStream, instance.CannonTotalSplats);
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

    Int32Proxy.Serialize(memoryStream, instance.HandgunTotalDamageDone);
    Int32Proxy.Serialize(memoryStream, instance.HandgunTotalShotsFired);
    Int32Proxy.Serialize(memoryStream, instance.HandgunTotalShotsHit);
    Int32Proxy.Serialize(memoryStream, instance.HandgunTotalSplats);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): PlayerWeaponStatisticsView {
    return new PlayerWeaponStatisticsView({
      CannonTotalDamageDone: Int32Proxy.Deserialize(bytes),
      CannonTotalShotsFired: Int32Proxy.Deserialize(bytes),
      CannonTotalShotsHit: Int32Proxy.Deserialize(bytes),
      CannonTotalSplats: Int32Proxy.Deserialize(bytes),
      LauncherTotalDamageDone: Int32Proxy.Deserialize(bytes),
      LauncherTotalShotsFired: Int32Proxy.Deserialize(bytes),
      LauncherTotalShotsHit: Int32Proxy.Deserialize(bytes),
      LauncherTotalSplats: Int32Proxy.Deserialize(bytes),
      MachineGunTotalDamageDone: Int32Proxy.Deserialize(bytes),
      MachineGunTotalShotsFired: Int32Proxy.Deserialize(bytes),
      MachineGunTotalShotsHit: Int32Proxy.Deserialize(bytes),
      MachineGunTotalSplats: Int32Proxy.Deserialize(bytes),
      MeleeTotalDamageDone: Int32Proxy.Deserialize(bytes),
      MeleeTotalShotsFired: Int32Proxy.Deserialize(bytes),
      MeleeTotalShotsHit: Int32Proxy.Deserialize(bytes),
      MeleeTotalSplats: Int32Proxy.Deserialize(bytes),
      ShotgunTotalDamageDone: Int32Proxy.Deserialize(bytes),
      ShotgunTotalShotsFired: Int32Proxy.Deserialize(bytes),
      ShotgunTotalShotsHit: Int32Proxy.Deserialize(bytes),
      ShotgunTotalSplats: Int32Proxy.Deserialize(bytes),
      SniperTotalDamageDone: Int32Proxy.Deserialize(bytes),
      SniperTotalShotsFired: Int32Proxy.Deserialize(bytes),
      SniperTotalShotsHit: Int32Proxy.Deserialize(bytes),
      SniperTotalSplats: Int32Proxy.Deserialize(bytes),
      SplattergunTotalDamageDone: Int32Proxy.Deserialize(bytes),
      SplattergunTotalShotsFired: Int32Proxy.Deserialize(bytes),
      SplattergunTotalShotsHit: Int32Proxy.Deserialize(bytes),
      SplattergunTotalSplats: Int32Proxy.Deserialize(bytes),

      HandgunTotalDamageDone: Int32Proxy.Deserialize(bytes),
      HandgunTotalShotsFired: Int32Proxy.Deserialize(bytes),
      HandgunTotalShotsHit: Int32Proxy.Deserialize(bytes),
      HandgunTotalSplats: Int32Proxy.Deserialize(bytes),
    });
  }
}
