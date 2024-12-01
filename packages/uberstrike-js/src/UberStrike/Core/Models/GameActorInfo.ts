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

import { ChannelType, MemberAccessLevel } from '@/Cmune/DataCenter/Common/Entities';
import BodyPart from './BodyPart';
import FireMode from './FireMode';
import PlayerStates from './PlayerStates';
import SurfaceType from './SurfaceType';
import TeamID from './TeamID';

export default class GameActorInfo {
  Cmid: number;
  PlayerName: string;
  AccessLevel: MemberAccessLevel;
  Channel: ChannelType;
  ClanTag: string;
  Rank: number;
  PlayerId: number;
  PlayerState: PlayerStates;
  Health: number;
  TeamID: TeamID;
  Level: number;
  Ping: number;
  CurrentWeaponSlot: number;
  CurrentFiringMode: FireMode;
  ArmorPoints: number;
  ArmorPointCapacity: number;
  SkinColor: Color;
  Kills: number;
  Deaths: number;
  Weapons: number[] = [0, 0, 0, 0];
  Gear: number[] = [0, 0, 0, 0, 0, 0, 0];
  FunctionalItems: number[] = [0, 0, 0];
  QuickItems: number[] = [0, 0, 0];
  StepSound: SurfaceType;

  get IsFiring(): boolean {
    return this.Is(PlayerStates.Shooting);
  }

  get IsReadyForGame(): boolean {
    return this.Is(PlayerStates.Ready);
  }

  get IsOnline(): boolean {
    return !this.Is(PlayerStates.Offline);
  }

  CurrentWeaponID(): number {
    return this.Weapons == null || this.Weapons.length <= this.CurrentWeaponSlot
      ? 0
      : this.Weapons[this.CurrentWeaponSlot];
  }

  get IsAlive(): boolean {
    return (this.PlayerState & PlayerStates.Dead) === 0;
  }

  get IsSpectator(): boolean {
    return (this.PlayerState & PlayerStates.Spectator) !== 0;
  }

  constructor(params: Partial<GameActorInfo> = {}) {
    Object.assign(this, params);
  }

  Is(state: PlayerStates): boolean {
    return (this.PlayerState & state) !== 0;
  }

  GetAbsorptionRate(): number {
    return 0.66;
  }

  Damage(damage: number, part: BodyPart): { healthDamage: number; armorDamage: number } {
    let healthDamage = 0;
    let armorDamage = 0;

    if (this.ArmorPoints > 0) {
      const num = Math.ceil(this.GetAbsorptionRate() * damage);
      armorDamage = Math.clamp(num, 0, this.ArmorPoints);
      healthDamage = damage - armorDamage;
    } else {
      armorDamage = 0;
      healthDamage = damage;
    }

    return { healthDamage, armorDamage };
  }
}
