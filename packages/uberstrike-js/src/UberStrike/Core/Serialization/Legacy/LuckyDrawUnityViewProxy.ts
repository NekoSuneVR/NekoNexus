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

import {
  BundleCategoryType,
  LuckyDrawSetUnityView,
  LuckyDrawUnityView,
  UberStrikeCurrencyType,
} from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from '../BooleanProxy';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import StringProxy from '../StringProxy';
import LuckyDrawSetUnityViewProxy from './LuckyDrawSetUnityViewProxy';

export default class LuckyDrawUnityViewProxy {
  static Serialize(stream: number[], instance: LuckyDrawUnityView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      EnumProxy.Serialize<BundleCategoryType>(memoryStream, instance.Category);
      if (instance.Description) {
        StringProxy.Serialize(memoryStream, instance.Description);
      } else {
        num |= 1;
      }
      if (instance.IconUrl) {
        StringProxy.Serialize(memoryStream, instance.IconUrl);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(memoryStream, instance.Id);
      BooleanProxy.Serialize(memoryStream, instance.IsAvailableInShop);
      if (instance.LuckyDrawSets) {
        ListProxy.Serialize<LuckyDrawSetUnityView>(
          memoryStream,
          instance.LuckyDrawSets,
          LuckyDrawSetUnityViewProxy.Serialize,
        );
      } else {
        num |= 4;
      }
      if (instance.Name) {
        StringProxy.Serialize(memoryStream, instance.Name);
      } else {
        num |= 8;
      }
      Int32Proxy.Serialize(memoryStream, instance.Price);
      EnumProxy.Serialize<UberStrikeCurrencyType>(memoryStream, instance.UberStrikeCurrencyType);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): LuckyDrawUnityView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let luckyDrawUnityView: LuckyDrawUnityView | null = null;
    if (num !== 0) {
      luckyDrawUnityView = new LuckyDrawUnityView();
      luckyDrawUnityView.Category = EnumProxy.Deserialize<BundleCategoryType>(bytes);
      if ((num & 1) !== 0) {
        luckyDrawUnityView.Description = StringProxy.Deserialize(bytes);
      }
      if ((num & 2) !== 0) {
        luckyDrawUnityView.IconUrl = StringProxy.Deserialize(bytes);
      }
      luckyDrawUnityView.Id = Int32Proxy.Deserialize(bytes);
      luckyDrawUnityView.IsAvailableInShop = BooleanProxy.Deserialize(bytes);
      if ((num & 4) !== 0) {
        luckyDrawUnityView.LuckyDrawSets = ListProxy.Deserialize<LuckyDrawSetUnityView>(
          bytes,
          LuckyDrawSetUnityViewProxy.Deserialize,
        );
      }
      if ((num & 8) !== 0) {
        luckyDrawUnityView.Name = StringProxy.Deserialize(bytes);
      }
      luckyDrawUnityView.Price = Int32Proxy.Deserialize(bytes);
      luckyDrawUnityView.UberStrikeCurrencyType = EnumProxy.Deserialize<UberStrikeCurrencyType>(bytes);
    }
    return luckyDrawUnityView;
  }
}
