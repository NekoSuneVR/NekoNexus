import { AvatarType } from '@/UberStrike/Core/Types';

export default class LoadoutView {
  public LoadoutId: int;
  public Backpack: int;
  public Boots: int;
  public Cmid: int;
  public Face: int;
  public FunctionalItem1: int;
  public FunctionalItem2: int;
  public FunctionalItem3: int;
  public Gloves: int;
  public Head: int;
  public LowerBody: int;
  public MeleeWeapon: int;
  public QuickItem1: int;
  public QuickItem2: int;
  public QuickItem3: int;
  public Type: AvatarType = AvatarType.LutzRavinoff;
  public UpperBody: int;
  public Weapon1: int;
  public Weapon1Mod1: int;
  public Weapon1Mod2: int;
  public Weapon1Mod3: int;
  public Weapon2: int;
  public Weapon2Mod1: int;
  public Weapon2Mod2: int;
  public Weapon2Mod3: int;
  public Weapon3: int;
  public Weapon3Mod1: int;
  public Weapon3Mod2: int;
  public Weapon3Mod3: int;
  public Webbing: int;
  public SkinColor: string = '';

  constructor(params: any = {}) {
    Object.keys(params)
      .filter((key) => key in this)
      .forEach((key) => {
        this[key] = params[key];
      });
  }

  public toString(): string {
    return `[LoadoutView: [Backpack: ${this.Backpack}][Boots: ${this.Boots}][Cmid: ${this.Cmid}][Face: ${this.Face}][FunctionalItem1: ${this.FunctionalItem1}][FunctionalItem2: ${this.FunctionalItem2}][FunctionalItem3: ${this.FunctionalItem3}][Gloves: ${this.Gloves}][Head: ${this.Head}][LoadoutId: ${this.LoadoutId}][LowerBody: ${this.LowerBody}][MeleeWeapon: ${this.MeleeWeapon}][QuickItem1: ${this.QuickItem1}][QuickItem2: ${this.QuickItem2}][QuickItem3: ${this.QuickItem3}][Type: ${this.Type}][UpperBody: ${this.UpperBody}][Weapon1: ${this.Weapon1}][Weapon1Mod1: ${this.Weapon1Mod1}][Weapon1Mod2: ${this.Weapon1Mod2}][Weapon1Mod3: ${this.Weapon1Mod3}][Weapon2: ${this.Weapon2}][Weapon2Mod1: ${this.Weapon2Mod1}][Weapon2Mod2: ${this.Weapon2Mod2}][Weapon2Mod3: ${this.Weapon2Mod3}][Weapon3: ${this.Weapon3}][Weapon3Mod1: ${this.Weapon3Mod1}][Weapon3Mod2: ${this.Weapon3Mod2}][Weapon3Mod3: ${this.Weapon3Mod3}][Webbing: ${this.Webbing}][SkinColor: ${this.SkinColor}]]`;
  }
}
