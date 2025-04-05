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

import { BundleCategoryType, BundleItemView, BundleView, ChannelType } from '@/Cmune/DataCenter/Common/Entities';
import BooleanProxy from '../BooleanProxy';
import DecimalProxy from '../DecimalProxy';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import StringProxy from '../StringProxy';
import BundleItemViewProxy from './BundleItemViewProxy';

export default class BundleViewProxy {
  static Serialize(stream: number[], instance: BundleView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, instance.ApplicationId);
      if (instance.Availability) {
        ListProxy.Serialize<ChannelType>(memoryStream, instance.Availability, EnumProxy.Serialize<ChannelType>);
      } else {
        num |= 1;
      }
      if (instance.BundleItemViews) {
        ListProxy.Serialize<BundleItemView>(memoryStream, instance.BundleItemViews, BundleItemViewProxy.Serialize);
      } else {
        num |= 2;
      }
      EnumProxy.Serialize<BundleCategoryType>(memoryStream, instance.Category);
      Int32Proxy.Serialize(memoryStream, instance.Credits);
      if (instance.Description) {
        StringProxy.Serialize(memoryStream, instance.Description);
      } else {
        num |= 4;
      }
      if (instance.IconUrl) {
        StringProxy.Serialize(memoryStream, instance.IconUrl);
      } else {
        num |= 8;
      }
      Int32Proxy.Serialize(memoryStream, instance.Id);
      if (instance.ImageUrl) {
        StringProxy.Serialize(memoryStream, instance.ImageUrl);
      } else {
        num |= 16;
      }
      if (instance.IosAppStoreUniqueId) {
        StringProxy.Serialize(memoryStream, instance.IosAppStoreUniqueId);
      } else {
        num |= 32;
      }
      BooleanProxy.Serialize(memoryStream, instance.IsDefault);
      BooleanProxy.Serialize(memoryStream, instance.IsOnSale);
      BooleanProxy.Serialize(memoryStream, instance.IsPromoted);
      if (instance.MacAppStoreUniqueId) {
        StringProxy.Serialize(memoryStream, instance.MacAppStoreUniqueId);
      } else {
        num |= 64;
      }
      if (instance.Name) {
        StringProxy.Serialize(memoryStream, instance.Name);
      } else {
        num |= 128;
      }
      Int32Proxy.Serialize(memoryStream, instance.Points);
      if (instance.PromotionTag) {
        StringProxy.Serialize(memoryStream, instance.PromotionTag);
      } else {
        num |= 256;
      }
      DecimalProxy.Serialize(memoryStream, instance.USDPrice);
      DecimalProxy.Serialize(memoryStream, instance.USDPromoPrice);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
    } else {
      Int32Proxy.Serialize(stream, 0);
    }
  }

  static Deserialize(bytes: number[]): BundleView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let bundleView: BundleView | null = null;
    if (num !== 0) {
      bundleView = new BundleView();
      bundleView.ApplicationId = Int32Proxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        bundleView.Availability = ListProxy.Deserialize<ChannelType>(bytes, EnumProxy.Deserialize<ChannelType>);
      }
      if ((num & 2) !== 0) {
        bundleView.BundleItemViews = ListProxy.Deserialize<BundleItemView>(bytes, BundleItemViewProxy.Deserialize);
      }
      bundleView.Category = EnumProxy.Deserialize<BundleCategoryType>(bytes);
      bundleView.Credits = Int32Proxy.Deserialize(bytes);
      if ((num & 4) !== 0) {
        bundleView.Description = StringProxy.Deserialize(bytes);
      }
      if ((num & 8) !== 0) {
        bundleView.IconUrl = StringProxy.Deserialize(bytes);
      }
      bundleView.Id = Int32Proxy.Deserialize(bytes);
      if ((num & 16) !== 0) {
        bundleView.ImageUrl = StringProxy.Deserialize(bytes);
      }
      if ((num & 32) !== 0) {
        bundleView.IosAppStoreUniqueId = StringProxy.Deserialize(bytes);
      }
      bundleView.IsDefault = BooleanProxy.Deserialize(bytes);
      bundleView.IsOnSale = BooleanProxy.Deserialize(bytes);
      bundleView.IsPromoted = BooleanProxy.Deserialize(bytes);
      if ((num & 64) !== 0) {
        bundleView.MacAppStoreUniqueId = StringProxy.Deserialize(bytes);
      }
      if ((num & 128) !== 0) {
        bundleView.Name = StringProxy.Deserialize(bytes);
      }
      bundleView.Points = Int32Proxy.Deserialize(bytes);
      if ((num & 256) !== 0) {
        bundleView.PromotionTag = StringProxy.Deserialize(bytes);
      }
      bundleView.USDPrice = DecimalProxy.Deserialize(bytes);
      bundleView.USDPromoPrice = DecimalProxy.Deserialize(bytes);
    }
    return bundleView;
  }
}
