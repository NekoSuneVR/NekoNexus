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

import { AvatarType } from '@/UberStrike/Core/Types';

export default class LoadoutView {
  LoadoutId: number;
  Backpack: number;
  Boots: number;
  Cmid: number;
  Face: number;
  FunctionalItem1: number;
  FunctionalItem2: number;
  FunctionalItem3: number;
  Gloves: number;
  Head: number;
  LowerBody: number;
  MeleeWeapon: number;
  QuickItem1: number;
  QuickItem2: number;
  QuickItem3: number;
  Type: AvatarType = AvatarType.LutzRavinoff;
  UpperBody: number;
  Weapon1: number;
  Weapon1Mod1: number;
  Weapon1Mod2: number;
  Weapon1Mod3: number;
  Weapon2: number;
  Weapon2Mod1: number;
  Weapon2Mod2: number;
  Weapon2Mod3: number;
  Weapon3: number;
  Weapon3Mod1: number;
  Weapon3Mod2: number;
  Weapon3Mod3: number;
  Webbing: number;
  SkinColor: string = '';

  constructor(params: Partial<LoadoutView> = {}) {
    Object.assign(this, params);
  }

  toString(): string {
    return `[LoadoutView: [Backpack: ${this.Backpack}][Boots: ${this.Boots}][Cmid: ${this.Cmid}][Face: ${this.Face}][FunctionalItem1: ${this.FunctionalItem1}][FunctionalItem2: ${this.FunctionalItem2}][FunctionalItem3: ${this.FunctionalItem3}][Gloves: ${this.Gloves}][Head: ${this.Head}][LoadoutId: ${this.LoadoutId}][LowerBody: ${this.LowerBody}][MeleeWeapon: ${this.MeleeWeapon}][QuickItem1: ${this.QuickItem1}][QuickItem2: ${this.QuickItem2}][QuickItem3: ${this.QuickItem3}][Type: ${this.Type}][UpperBody: ${this.UpperBody}][Weapon1: ${this.Weapon1}][Weapon1Mod1: ${this.Weapon1Mod1}][Weapon1Mod2: ${this.Weapon1Mod2}][Weapon1Mod3: ${this.Weapon1Mod3}][Weapon2: ${this.Weapon2}][Weapon2Mod1: ${this.Weapon2Mod1}][Weapon2Mod2: ${this.Weapon2Mod2}][Weapon2Mod3: ${this.Weapon2Mod3}][Weapon3: ${this.Weapon3}][Weapon3Mod1: ${this.Weapon3Mod1}][Weapon3Mod2: ${this.Weapon3Mod2}][Weapon3Mod3: ${this.Weapon3Mod3}][Webbing: ${this.Webbing}][SkinColor: ${this.SkinColor}]]`;
  }
}
