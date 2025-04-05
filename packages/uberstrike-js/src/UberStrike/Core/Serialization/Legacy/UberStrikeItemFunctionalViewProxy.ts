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

import { ItemPrice, UberStrikeItemFunctionalView } from '@/UberStrike/Core/Models/Views';
import { ItemShopHighlightType, UberstrikeItemClass } from '@/UberStrike/Core/Types';
import BooleanProxy from '../BooleanProxy';
import DictionaryProxy from '../DictionaryProxy';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import StringProxy from '../StringProxy';
import ItemPriceProxy from './ItemPriceProxy';

export default class UberStrikeItemFunctionalViewProxy {
  static Serialize(stream: number[], instance: UberStrikeItemFunctionalView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      if (instance.CustomProperties) {
        DictionaryProxy.Serialize<string, string>(
          memoryStream,
          instance.CustomProperties,
          StringProxy.Serialize,
          StringProxy.Serialize,
        );
      } else {
        num |= 1;
      }
      if (instance.Description) {
        StringProxy.Serialize(memoryStream, instance.Description);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(memoryStream, instance.ID);
      BooleanProxy.Serialize(memoryStream, instance.IsConsumable);
      EnumProxy.Serialize<UberstrikeItemClass>(memoryStream, instance.ItemClass);
      Int32Proxy.Serialize(memoryStream, instance.LevelLock);
      if (instance.Name) {
        StringProxy.Serialize(memoryStream, instance.Name);
      } else {
        num |= 4;
      }
      if (instance.PrefabName) {
        StringProxy.Serialize(memoryStream, instance.PrefabName);
      } else {
        num |= 8;
      }
      if (instance.Prices) {
        ListProxy.Serialize<ItemPrice>(memoryStream, instance.Prices, ItemPriceProxy.Serialize);
      } else {
        num |= 16;
      }
      EnumProxy.Serialize<ItemShopHighlightType>(memoryStream, instance.ShopHighlightType);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
      return;
    }
    Int32Proxy.Serialize(stream, 0);
  }

  static Deserialize(bytes: number[]): UberStrikeItemFunctionalView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let uberStrikeItemFunctionalView: UberStrikeItemFunctionalView | null = null;
    if (num !== 0) {
      uberStrikeItemFunctionalView = new UberStrikeItemFunctionalView();
      if ((num & 1) !== 0) {
        uberStrikeItemFunctionalView.CustomProperties = DictionaryProxy.Deserialize<string, string>(
          bytes,
          StringProxy.Deserialize,
          StringProxy.Deserialize,
        );
      }
      if ((num & 2) !== 0) {
        uberStrikeItemFunctionalView.Description = StringProxy.Deserialize(bytes);
      }
      uberStrikeItemFunctionalView.ID = Int32Proxy.Deserialize(bytes);
      uberStrikeItemFunctionalView.IsConsumable = BooleanProxy.Deserialize(bytes);
      uberStrikeItemFunctionalView.ItemClass = EnumProxy.Deserialize<UberstrikeItemClass>(bytes);
      uberStrikeItemFunctionalView.LevelLock = Int32Proxy.Deserialize(bytes);
      if ((num & 4) !== 0) {
        uberStrikeItemFunctionalView.Name = StringProxy.Deserialize(bytes);
      }
      if ((num & 8) !== 0) {
        uberStrikeItemFunctionalView.PrefabName = StringProxy.Deserialize(bytes);
      }
      if ((num & 16) !== 0) {
        uberStrikeItemFunctionalView.Prices = ListProxy.Deserialize<ItemPrice>(bytes, ItemPriceProxy.Deserialize);
      }
      uberStrikeItemFunctionalView.ShopHighlightType = EnumProxy.Deserialize<ItemShopHighlightType>(bytes);
    }
    return uberStrikeItemFunctionalView;
  }
}
