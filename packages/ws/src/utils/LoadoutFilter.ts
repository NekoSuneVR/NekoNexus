import { PlayerInventoryItem, PlayerLoadout } from '@/models';
import { LoadoutView } from '@festivaldev/uberstrike-js/UberStrike/DataCenter/Common/Entities';

export default class LoadoutFilter {
  public static Filter<T extends LoadoutView | PlayerLoadout>(
    loadoutView: T,
    playerInventory: PlayerInventoryItem[],
  ): T {
    if (loadoutView.UpperBody !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.UpperBody))
      loadoutView.UpperBody = 0;
    if (loadoutView.Weapon1 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Weapon1))
      loadoutView.Weapon1 = 0;
    if (loadoutView.Weapon2 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Weapon2))
      loadoutView.Weapon2 = 0;
    if (loadoutView.Weapon3 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Weapon3))
      loadoutView.Weapon3 = 0;
    if (loadoutView.QuickItem3 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.QuickItem3))
      loadoutView.QuickItem3 = 0;
    if (loadoutView.QuickItem2 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.QuickItem2))
      loadoutView.QuickItem2 = 0;
    if (loadoutView.QuickItem1 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.QuickItem1))
      loadoutView.QuickItem1 = 0;
    if (loadoutView.MeleeWeapon !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.MeleeWeapon))
      loadoutView.MeleeWeapon = 0;
    if (loadoutView.LowerBody !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.LowerBody))
      loadoutView.LowerBody = 0;
    if (loadoutView.Head !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Head)) loadoutView.Head = 0;
    if (loadoutView.Gloves !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Gloves))
      loadoutView.Gloves = 0;
    if (loadoutView.FunctionalItem3 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.FunctionalItem3))
      loadoutView.FunctionalItem3 = 0;
    if (loadoutView.FunctionalItem2 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.FunctionalItem2))
      loadoutView.FunctionalItem2 = 0;
    if (loadoutView.FunctionalItem1 !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.FunctionalItem1))
      loadoutView.FunctionalItem1 = 0;
    if (loadoutView.Face !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Face)) loadoutView.Face = 0;
    if (loadoutView.Boots !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Boots)) loadoutView.Boots = 0;
    if (loadoutView.Backpack !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Backpack))
      loadoutView.Backpack = 0;
    if (loadoutView.Webbing !== 0 && !playerInventory.find((_) => _.ItemId === loadoutView.Webbing))
      loadoutView.Webbing = 0;

    return loadoutView;
  }
}
