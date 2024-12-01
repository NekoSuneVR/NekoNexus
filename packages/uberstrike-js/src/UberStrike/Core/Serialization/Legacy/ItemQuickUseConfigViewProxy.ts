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

import { QuickItemLogic } from '@/UberStrike/Core/Types';
import { ItemQuickUseConfigView } from '@/UberStrike/DataCenter/Common/Entities';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';

export default class ItemQuickUseConfigViewProxy {
  static Serialize(stream: number[], instance: ItemQuickUseConfigView): void {
    const num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      EnumProxy.Serialize<QuickItemLogic>(memoryStream, instance.BehaviourType);
      Int32Proxy.Serialize(memoryStream, instance.CoolDownTime);
      Int32Proxy.Serialize(memoryStream, instance.ItemId);
      Int32Proxy.Serialize(memoryStream, instance.LevelRequired);
      Int32Proxy.Serialize(memoryStream, instance.UsesPerGame);
      Int32Proxy.Serialize(memoryStream, instance.UsesPerLife);
      Int32Proxy.Serialize(memoryStream, instance.UsesPerRound);
      Int32Proxy.Serialize(memoryStream, instance.WarmUpTime);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): ItemQuickUseConfigView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let itemQuickUseConfigView: ItemQuickUseConfigView | null = null;
    if (num !== 0) {
      itemQuickUseConfigView = new ItemQuickUseConfigView();
      itemQuickUseConfigView.BehaviourType = EnumProxy.Deserialize<QuickItemLogic>(bytes);
      itemQuickUseConfigView.CoolDownTime = Int32Proxy.Deserialize(bytes);
      itemQuickUseConfigView.ItemId = Int32Proxy.Deserialize(bytes);
      itemQuickUseConfigView.LevelRequired = Int32Proxy.Deserialize(bytes);
      itemQuickUseConfigView.UsesPerGame = Int32Proxy.Deserialize(bytes);
      itemQuickUseConfigView.UsesPerLife = Int32Proxy.Deserialize(bytes);
      itemQuickUseConfigView.UsesPerRound = Int32Proxy.Deserialize(bytes);
      itemQuickUseConfigView.WarmUpTime = Int32Proxy.Deserialize(bytes);
    }
    return itemQuickUseConfigView;
  }
}
