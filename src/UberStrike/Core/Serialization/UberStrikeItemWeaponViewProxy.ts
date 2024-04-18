import { ItemPropertyType } from '@/Cmune/DataCenter/Common/Entities';
import { ItemPrice, UberStrikeItemWeaponView } from '@/UberStrike/Core/Models/Views';
import { ItemShopHighlightType, UberstrikeItemClass } from '@/UberStrike/Core/Types';
import BooleanProxy from './BooleanProxy';
import DictionaryProxy from './DictionaryProxy';
import EnumProxy from './EnumProxy';
import Int32Proxy from './Int32Proxy';
import ItemPriceProxy from './ItemPriceProxy';
import ListProxy from './ListProxy';
import StringProxy from './StringProxy';

export default class UberStrikeItemWeaponViewProxy {
  public static Serialize(stream: Stream, instance: UberStrikeItemWeaponView): void {
    let num = 0;

    const memoryStream: MemoryStream = [];
    Int32Proxy.Serialize(memoryStream, instance.AccuracySpread);
    Int32Proxy.Serialize(memoryStream, instance.CombatRange);
    Int32Proxy.Serialize(memoryStream, instance.CriticalStrikeBonus);

    if (instance.CustomProperties) {
      DictionaryProxy.Serialize<string, string>(memoryStream, instance.CustomProperties, StringProxy.Serialize, StringProxy.Serialize);
    } else {
      num |= 1;
    }

    Int32Proxy.Serialize(memoryStream, instance.DamageKnockback);
    Int32Proxy.Serialize(memoryStream, instance.DamagePerProjectile);
    Int32Proxy.Serialize(memoryStream, instance.DefaultZoomMultiplier);

    if (instance.Description) {
      StringProxy.Serialize(memoryStream, instance.Description);
    } else {
      num |= 2;
    }

    BooleanProxy.Serialize(memoryStream, instance.HasAutomaticFire);
    Int32Proxy.Serialize(memoryStream, instance.ID);
    BooleanProxy.Serialize(memoryStream, instance.IsConsumable);
    EnumProxy.Serialize<UberstrikeItemClass>(memoryStream, instance.ItemClass);

    if (instance.ItemProperties) {
      DictionaryProxy.Serialize<ItemPropertyType, int>(memoryStream, instance.ItemProperties, EnumProxy.Serialize<ItemPropertyType>, Int32Proxy.Serialize);
    } else {
      num |= 4;
    }

    Int32Proxy.Serialize(memoryStream, instance.LevelLock);
    Int32Proxy.Serialize(memoryStream, instance.MaxAmmo);
    Int32Proxy.Serialize(memoryStream, instance.MaxDurationDays);
    Int32Proxy.Serialize(memoryStream, instance.MaxZoomMultiplier);
    Int32Proxy.Serialize(memoryStream, instance.MinZoomMultiplier);
    Int32Proxy.Serialize(memoryStream, instance.MissileBounciness);
    Int32Proxy.Serialize(memoryStream, instance.MissileForceImpulse);
    Int32Proxy.Serialize(memoryStream, instance.MissileTimeToDetonate);

    if (instance.Name) {
      StringProxy.Serialize(memoryStream, instance.Name);
    } else {
      num |= 8;
    }

    if (instance.PrefabName) {
      StringProxy.Serialize(memoryStream, instance.PrefabName);
    } else {
      num |= 16;
    }

    if (instance.Prices) {
      ListProxy.Serialize<ItemPrice>(memoryStream, instance.Prices, ItemPriceProxy.Serialize);
    } else {
      num |= 32;
    }

    Int32Proxy.Serialize(memoryStream, instance.ProjectileSpeed);
    Int32Proxy.Serialize(memoryStream, instance.ProjectilesPerShot);
    Int32Proxy.Serialize(memoryStream, instance.RateOfFire);
    Int32Proxy.Serialize(memoryStream, instance.RecoilKickback);
    Int32Proxy.Serialize(memoryStream, instance.RecoilMovement);
    Int32Proxy.Serialize(memoryStream, instance.SecondaryActionReticle);
    EnumProxy.Serialize<ItemShopHighlightType>(memoryStream, instance.ShopHighlightType);
    Int32Proxy.Serialize(memoryStream, instance.SplashRadius);
    Int32Proxy.Serialize(memoryStream, instance.StartAmmo);
    Int32Proxy.Serialize(memoryStream, instance.Tier);
    Int32Proxy.Serialize(memoryStream, instance.WeaponSecondaryAction);
    Int32Proxy.Serialize(stream, ~num);
    memoryStream.WriteTo(stream);
  }

  public static Deserialize(bytes: Stream): UberStrikeItemWeaponView {
    const num = Int32Proxy.Deserialize(bytes);
    const uberStrikeItemWeaponView = new UberStrikeItemWeaponView();
    uberStrikeItemWeaponView.AccuracySpread = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.CombatRange = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.CriticalStrikeBonus = Int32Proxy.Deserialize(bytes);

    if ((num & 1) !== 0) {
      uberStrikeItemWeaponView.CustomProperties = DictionaryProxy.Deserialize<string, string>(bytes, StringProxy.Deserialize, StringProxy.Deserialize);
    }

    uberStrikeItemWeaponView.DamageKnockback = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.DamagePerProjectile = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.DefaultZoomMultiplier = Int32Proxy.Deserialize(bytes);

    if ((num & 2) !== 0) {
      uberStrikeItemWeaponView.Description = StringProxy.Deserialize(bytes);
    }

    uberStrikeItemWeaponView.HasAutomaticFire = BooleanProxy.Deserialize(bytes);
    uberStrikeItemWeaponView.ID = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.IsConsumable = BooleanProxy.Deserialize(bytes);
    uberStrikeItemWeaponView.ItemClass = EnumProxy.Deserialize<UberstrikeItemClass>(bytes);

    if ((num & 4) !== 0) {
      uberStrikeItemWeaponView.ItemProperties = DictionaryProxy.Deserialize<ItemPropertyType, int>(bytes, EnumProxy.Deserialize<ItemPropertyType>, Int32Proxy.Deserialize);
    }

    uberStrikeItemWeaponView.LevelLock = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.MaxAmmo = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.MaxDurationDays = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.MaxZoomMultiplier = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.MinZoomMultiplier = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.MissileBounciness = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.MissileForceImpulse = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.MissileTimeToDetonate = Int32Proxy.Deserialize(bytes);

    if ((num & 8) !== 0) {
      uberStrikeItemWeaponView.Name = StringProxy.Deserialize(bytes);
    }

    if ((num & 16) !== 0) {
      uberStrikeItemWeaponView.PrefabName = StringProxy.Deserialize(bytes);
    }

    if ((num & 32) !== 0) {
      uberStrikeItemWeaponView.Prices = ListProxy.Deserialize<ItemPrice>(bytes, ItemPriceProxy.Deserialize);
    }

    uberStrikeItemWeaponView.ProjectileSpeed = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.ProjectilesPerShot = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.RateOfFire = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.RecoilKickback = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.RecoilMovement = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.SecondaryActionReticle = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.ShopHighlightType = EnumProxy.Deserialize<ItemShopHighlightType>(bytes);
    uberStrikeItemWeaponView.SplashRadius = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.StartAmmo = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.Tier = Int32Proxy.Deserialize(bytes);
    uberStrikeItemWeaponView.WeaponSecondaryAction = Int32Proxy.Deserialize(bytes);

    return uberStrikeItemWeaponView;
  }
}
