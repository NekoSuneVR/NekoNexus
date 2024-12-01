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
import { LoadoutView } from '@/UberStrike/DataCenter/Common/Entities';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import StringProxy from '../StringProxy';

export default class LoadoutViewProxy {
  static Serialize(stream: number[], instance: LoadoutView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, instance.Backpack);
      Int32Proxy.Serialize(memoryStream, instance.Boots);
      Int32Proxy.Serialize(memoryStream, instance.Cmid);
      Int32Proxy.Serialize(memoryStream, instance.Face);
      Int32Proxy.Serialize(memoryStream, instance.FunctionalItem1);
      Int32Proxy.Serialize(memoryStream, instance.FunctionalItem2);
      Int32Proxy.Serialize(memoryStream, instance.FunctionalItem3);
      Int32Proxy.Serialize(memoryStream, instance.Gloves);
      Int32Proxy.Serialize(memoryStream, instance.Head);
      Int32Proxy.Serialize(memoryStream, instance.LoadoutId);
      Int32Proxy.Serialize(memoryStream, instance.LowerBody);
      Int32Proxy.Serialize(memoryStream, instance.MeleeWeapon);
      Int32Proxy.Serialize(memoryStream, instance.QuickItem1);
      Int32Proxy.Serialize(memoryStream, instance.QuickItem2);
      Int32Proxy.Serialize(memoryStream, instance.QuickItem3);
      if (instance.SkinColor != null) {
        StringProxy.Serialize(memoryStream, instance.SkinColor);
      } else {
        num |= 1;
      }
      EnumProxy.Serialize<AvatarType>(memoryStream, instance.Type);
      Int32Proxy.Serialize(memoryStream, instance.UpperBody);
      Int32Proxy.Serialize(memoryStream, instance.Weapon1);
      Int32Proxy.Serialize(memoryStream, instance.Weapon1Mod1);
      Int32Proxy.Serialize(memoryStream, instance.Weapon1Mod2);
      Int32Proxy.Serialize(memoryStream, instance.Weapon1Mod3);
      Int32Proxy.Serialize(memoryStream, instance.Weapon2);
      Int32Proxy.Serialize(memoryStream, instance.Weapon2Mod1);
      Int32Proxy.Serialize(memoryStream, instance.Weapon2Mod2);
      Int32Proxy.Serialize(memoryStream, instance.Weapon2Mod3);
      Int32Proxy.Serialize(memoryStream, instance.Weapon3);
      Int32Proxy.Serialize(memoryStream, instance.Weapon3Mod1);
      Int32Proxy.Serialize(memoryStream, instance.Weapon3Mod2);
      Int32Proxy.Serialize(memoryStream, instance.Weapon3Mod3);
      Int32Proxy.Serialize(memoryStream, instance.Webbing);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): LoadoutView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let loadoutView: LoadoutView | null = null;
    if (num !== 0) {
      loadoutView = new LoadoutView();
      loadoutView.Backpack = Int32Proxy.Deserialize(bytes);
      loadoutView.Boots = Int32Proxy.Deserialize(bytes);
      loadoutView.Cmid = Int32Proxy.Deserialize(bytes);
      loadoutView.Face = Int32Proxy.Deserialize(bytes);
      loadoutView.FunctionalItem1 = Int32Proxy.Deserialize(bytes);
      loadoutView.FunctionalItem2 = Int32Proxy.Deserialize(bytes);
      loadoutView.FunctionalItem3 = Int32Proxy.Deserialize(bytes);
      loadoutView.Gloves = Int32Proxy.Deserialize(bytes);
      loadoutView.Head = Int32Proxy.Deserialize(bytes);
      loadoutView.LoadoutId = Int32Proxy.Deserialize(bytes);
      loadoutView.LowerBody = Int32Proxy.Deserialize(bytes);
      loadoutView.MeleeWeapon = Int32Proxy.Deserialize(bytes);
      loadoutView.QuickItem1 = Int32Proxy.Deserialize(bytes);
      loadoutView.QuickItem2 = Int32Proxy.Deserialize(bytes);
      loadoutView.QuickItem3 = Int32Proxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        loadoutView.SkinColor = StringProxy.Deserialize(bytes);
      }
      loadoutView.Type = EnumProxy.Deserialize<AvatarType>(bytes);
      loadoutView.UpperBody = Int32Proxy.Deserialize(bytes);
      loadoutView.Weapon1 = Int32Proxy.Deserialize(bytes);
      loadoutView.Weapon1Mod1 = Int32Proxy.Deserialize(bytes);
      loadoutView.Weapon1Mod2 = Int32Proxy.Deserialize(bytes);
      loadoutView.Weapon1Mod3 = Int32Proxy.Deserialize(bytes);
      loadoutView.Weapon2 = Int32Proxy.Deserialize(bytes);
      loadoutView.Weapon2Mod1 = Int32Proxy.Deserialize(bytes);
      loadoutView.Weapon2Mod2 = Int32Proxy.Deserialize(bytes);
      loadoutView.Weapon2Mod3 = Int32Proxy.Deserialize(bytes);
      loadoutView.Weapon3 = Int32Proxy.Deserialize(bytes);
      loadoutView.Weapon3Mod1 = Int32Proxy.Deserialize(bytes);
      loadoutView.Weapon3Mod2 = Int32Proxy.Deserialize(bytes);
      loadoutView.Weapon3Mod3 = Int32Proxy.Deserialize(bytes);
      loadoutView.Webbing = Int32Proxy.Deserialize(bytes);
    }
    return loadoutView;
  }
}
