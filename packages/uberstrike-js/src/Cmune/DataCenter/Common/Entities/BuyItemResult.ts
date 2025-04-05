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

enum BuyItemResult {
  OK,
  DisableInShop,
  DisableForRent = 3,
  DisableForPermanent,
  DurationDisabled,
  PackDisabled,
  IsNotForSale,
  NotEnoughCurrency,
  InvalidMember,
  InvalidExpirationDate,
  AlreadyInInventory,
  InvalidAmount,
  NoStockRemaining,
  InvalidData,
  TooManyUsage,
  InvalidLevel = 100,
  ItemNotFound = 404,
}

export default BuyItemResult;
