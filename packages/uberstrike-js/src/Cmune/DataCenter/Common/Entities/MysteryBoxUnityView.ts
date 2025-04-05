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
import UberStrikeCurrencyType from './UberStrikeCurrencyType';

export default class MysteryBoxUnityView {
  Id: number;
  Name: string;
  Description: string;
  Price: number;
  UberStrikeCurrencyType: UberStrikeCurrencyType;
  IconUrl: string;
  Category: BundleCategoryType;
  IsAvailableInShop: boolean;
  ItemsAttributed: number;
  ImageUrl: string;
  ExposeItemsToPlayers: boolean;
  PointsAttributed: number;
  PointsAttributedWeight: number;
  CreditsAttributed: number;
  CreditsAttributedWeight: number;
  MysteryBoxItems: BundleItemView[];

  constructor(params: Partial<MysteryBoxUnityView> = {}) {
    Object.assign(this, params);
  }
}
