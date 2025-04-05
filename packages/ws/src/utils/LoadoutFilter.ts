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

import type { PlayerInventoryItem, PlayerLoadout } from '@festivaldev/paradise-models';
import type { LoadoutView } from '@festivaldev/uberstrike-js/UberStrike/DataCenter/Common/Entities';

export default class LoadoutFilter {
  static Filter<T extends LoadoutView | PlayerLoadout>(loadoutView: T, playerInventory: PlayerInventoryItem[]): T {
    if (loadoutView.UpperBody !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.UpperBody))
      loadoutView.UpperBody = 0;

    if (loadoutView.Weapon1 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Weapon1))
      loadoutView.Weapon1 = 0;

    if (loadoutView.Weapon2 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Weapon2))
      loadoutView.Weapon2 = 0;

    if (loadoutView.Weapon3 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Weapon3))
      loadoutView.Weapon3 = 0;

    if (loadoutView.QuickItem3 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.QuickItem3))
      loadoutView.QuickItem3 = 0;

    if (loadoutView.QuickItem2 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.QuickItem2))
      loadoutView.QuickItem2 = 0;

    if (loadoutView.QuickItem1 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.QuickItem1))
      loadoutView.QuickItem1 = 0;

    if (loadoutView.MeleeWeapon !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.MeleeWeapon))
      loadoutView.MeleeWeapon = 0;

    if (loadoutView.LowerBody !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.LowerBody))
      loadoutView.LowerBody = 0;

    if (loadoutView.Head !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Head)) loadoutView.Head = 0;

    if (loadoutView.Gloves !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Gloves))
      loadoutView.Gloves = 0;

    if (loadoutView.FunctionalItem3 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.FunctionalItem3))
      loadoutView.FunctionalItem3 = 0;

    if (loadoutView.FunctionalItem2 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.FunctionalItem2))
      loadoutView.FunctionalItem2 = 0;

    if (loadoutView.FunctionalItem1 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.FunctionalItem1))
      loadoutView.FunctionalItem1 = 0;

    if (loadoutView.Face !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Face)) loadoutView.Face = 0;

    if (loadoutView.Boots !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Boots)) loadoutView.Boots = 0;

    if (loadoutView.Backpack !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Backpack))
      loadoutView.Backpack = 0;

    if (loadoutView.Webbing !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Webbing))
      loadoutView.Webbing = 0;

    return loadoutView;
  }
}
