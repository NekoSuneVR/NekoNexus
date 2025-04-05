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

import { ItemPrice, UberStrikeItemWeaponView } from '@/UberStrike/Core/Models/Views';
import { ItemShopHighlightType, UberstrikeItemClass } from '@/UberStrike/Core/Types';
import BooleanProxy from '../BooleanProxy';
import DictionaryProxy from '../DictionaryProxy';
import EnumProxy from '../EnumProxy';
import Int32Proxy from '../Int32Proxy';
import ListProxy from '../ListProxy';
import StringProxy from '../StringProxy';
import ItemPriceProxy from './ItemPriceProxy';

export default class UberStrikeItemWeaponViewProxy {
  static Serialize(stream: number[], instance: UberStrikeItemWeaponView): void {
    let num = 0;
    if (instance) {
      const memoryStream: number[] = [];
      Int32Proxy.Serialize(memoryStream, instance.AccuracySpread);
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
      Int32Proxy.Serialize(memoryStream, instance.DamageKnockback);
      Int32Proxy.Serialize(memoryStream, instance.DamagePerProjectile);
      if (instance.Description) {
        StringProxy.Serialize(memoryStream, instance.Description);
      } else {
        num |= 2;
      }
      Int32Proxy.Serialize(memoryStream, instance.ID);
      BooleanProxy.Serialize(memoryStream, instance.IsConsumable);
      EnumProxy.Serialize<UberstrikeItemClass>(memoryStream, instance.ItemClass);
      Int32Proxy.Serialize(memoryStream, instance.LevelLock);
      Int32Proxy.Serialize(memoryStream, instance.MaxAmmo);
      Int32Proxy.Serialize(memoryStream, instance.MissileBounciness);
      Int32Proxy.Serialize(memoryStream, instance.MissileForceImpulse);
      Int32Proxy.Serialize(memoryStream, instance.MissileTimeToDetonate);
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
      Int32Proxy.Serialize(memoryStream, instance.ProjectileSpeed);
      Int32Proxy.Serialize(memoryStream, instance.ProjectilesPerShot);
      Int32Proxy.Serialize(memoryStream, instance.RateOfFire);
      Int32Proxy.Serialize(memoryStream, instance.RecoilKickback);
      Int32Proxy.Serialize(memoryStream, instance.RecoilMovement);
      EnumProxy.Serialize<ItemShopHighlightType>(memoryStream, instance.ShopHighlightType);
      Int32Proxy.Serialize(memoryStream, instance.SplashRadius);
      Int32Proxy.Serialize(memoryStream, instance.StartAmmo);
      Int32Proxy.Serialize(stream, ~num);
      memoryStream.writeTo(stream);
      return;
    }
    Int32Proxy.Serialize(stream, 0);
  }

  static Deserialize(bytes: number[]): UberStrikeItemWeaponView | null {
    const num = Int32Proxy.Deserialize(bytes);
    let uberStrikeItemWeaponView: UberStrikeItemWeaponView | null = null;
    if (num !== 0) {
      uberStrikeItemWeaponView = new UberStrikeItemWeaponView();
      uberStrikeItemWeaponView.AccuracySpread = Int32Proxy.Deserialize(bytes);
      if ((num & 1) !== 0) {
        uberStrikeItemWeaponView.CustomProperties = DictionaryProxy.Deserialize<string, string>(
          bytes,
          StringProxy.Deserialize,
          StringProxy.Deserialize,
        );
      }
      uberStrikeItemWeaponView.DamageKnockback = Int32Proxy.Deserialize(bytes);
      uberStrikeItemWeaponView.DamagePerProjectile = Int32Proxy.Deserialize(bytes);
      if ((num & 2) !== 0) {
        uberStrikeItemWeaponView.Description = StringProxy.Deserialize(bytes);
      }
      uberStrikeItemWeaponView.ID = Int32Proxy.Deserialize(bytes);
      uberStrikeItemWeaponView.IsConsumable = BooleanProxy.Deserialize(bytes);
      uberStrikeItemWeaponView.ItemClass = EnumProxy.Deserialize<UberstrikeItemClass>(bytes);
      uberStrikeItemWeaponView.LevelLock = Int32Proxy.Deserialize(bytes);
      uberStrikeItemWeaponView.MaxAmmo = Int32Proxy.Deserialize(bytes);
      uberStrikeItemWeaponView.MissileBounciness = Int32Proxy.Deserialize(bytes);
      uberStrikeItemWeaponView.MissileForceImpulse = Int32Proxy.Deserialize(bytes);
      uberStrikeItemWeaponView.MissileTimeToDetonate = Int32Proxy.Deserialize(bytes);
      if ((num & 4) !== 0) {
        uberStrikeItemWeaponView.Name = StringProxy.Deserialize(bytes);
      }
      if ((num & 8) !== 0) {
        uberStrikeItemWeaponView.PrefabName = StringProxy.Deserialize(bytes);
      }
      if ((num & 16) !== 0) {
        uberStrikeItemWeaponView.Prices = ListProxy.Deserialize<ItemPrice>(bytes, ItemPriceProxy.Deserialize);
      }
      uberStrikeItemWeaponView.ProjectileSpeed = Int32Proxy.Deserialize(bytes);
      uberStrikeItemWeaponView.ProjectilesPerShot = Int32Proxy.Deserialize(bytes);
      uberStrikeItemWeaponView.RateOfFire = Int32Proxy.Deserialize(bytes);
      uberStrikeItemWeaponView.RecoilKickback = Int32Proxy.Deserialize(bytes);
      uberStrikeItemWeaponView.RecoilMovement = Int32Proxy.Deserialize(bytes);
      uberStrikeItemWeaponView.ShopHighlightType = EnumProxy.Deserialize<ItemShopHighlightType>(bytes);
      uberStrikeItemWeaponView.SplashRadius = Int32Proxy.Deserialize(bytes);
      uberStrikeItemWeaponView.StartAmmo = Int32Proxy.Deserialize(bytes);
    }
    return uberStrikeItemWeaponView;
  }
}
