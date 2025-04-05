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

import { BundleItemView, LuckyDrawSetUnityView } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from './BooleanProxy';
import BundleItemViewProxy from './BundleItemViewProxy';
import Int32Proxy from './Int32Proxy';
import ListProxy from './ListProxy';
import StringProxy from './StringProxy';

export default class LuckyDrawSetUnityViewProxy {
  static Serialize(stream: number[], instance: LuckyDrawSetUnityView): void {
    let num = 0;

    const memoryStream: number[] = [];
    Int32Proxy.Serialize(memoryStream, instance.CreditsAttributed);
    BooleanProxy.Serialize(memoryStream, instance.ExposeItemsToPlayers);
    Int32Proxy.Serialize(memoryStream, instance.Id);

    if (instance.ImageUrl) {
      StringProxy.Serialize(memoryStream, instance.ImageUrl);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.LuckyDrawId);

    if (instance.LuckyDrawSetItems) {
      ListProxy.Serialize<BundleItemView>(memoryStream, instance.LuckyDrawSetItems, BundleItemViewProxy.Serialize);
    } else {
      num |= 2;
    }

    Int32Proxy.Serialize(memoryStream, instance.PointsAttributed);
    Int32Proxy.Serialize(memoryStream, instance.SetWeight);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.writeTo(stream);
  }

  static Deserialize(bytes: number[]): LuckyDrawSetUnityView {
    const num = Int32Proxy.Deserialize(bytes);
    const luckyDrawSetUnityView = new LuckyDrawSetUnityView();
    luckyDrawSetUnityView.CreditsAttributed = Int32Proxy.Deserialize(bytes);
    luckyDrawSetUnityView.ExposeItemsToPlayers = BooleanProxy.Deserialize(bytes);
    luckyDrawSetUnityView.Id = Int32Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      luckyDrawSetUnityView.ImageUrl = StringProxy.Deserialize(bytes);
    }

    luckyDrawSetUnityView.LuckyDrawId = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      luckyDrawSetUnityView.LuckyDrawSetItems = ListProxy.Deserialize<BundleItemView>(
        bytes,
        BundleItemViewProxy.Deserialize,
      );
    }

    luckyDrawSetUnityView.PointsAttributed = Int32Proxy.Deserialize(bytes);
    luckyDrawSetUnityView.SetWeight = Int32Proxy.Deserialize(bytes);

    return luckyDrawSetUnityView;
  }
}
