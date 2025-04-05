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

import BundleCategoryType from './BundleCategoryType';
import BundleItemView from './BundleItemView';
import ChannelType from './ChannelType';

export default class BundleView {
  Id: number;
  ApplicationId: number;
  Name: string;
  ImageUrl: string;
  IconUrl: string;
  Description: string;
  IsOnSale: boolean;
  IsPromoted: boolean;
  USDPrice: number;
  USDPromoPrice: number;
  Credits: number;
  Points: number;
  BundleItemViews: BundleItemView[];
  Category: BundleCategoryType;
  Availability: ChannelType[];
  PromotionTag: string;
  MacAppStoreUniqueId: string;
  IosAppStoreUniqueId: string;
  AndroidStoreUniqueId: string;
  IsDefault: boolean;

  constructor(params: Partial<BundleView> = {}) {
    Object.assign(this, params);
  }
}
