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

export enum AvatarType {
  LutzRavinoff,
  JuliaEnzo,
  MorgenRavinoff,
  DanaHoyt,
  HumeZombie,
  TechZombie,
  JuliaNinja,
  Lola,
  LolaAvatar,
  LolaBlack,
}

export enum DefinitionType {
  None,
  StandardDefinition,
  HighDefinition,
  Android,
  iPhone,
}

export enum GameModeType {
  None,
  DeathMatch,
  TeamDeathMatch,
  EliminationMode,
}

export enum ItemShopHighlightType {
  None,
  Featured,
  Popular,
  New,
}

export enum LoadoutSlotType {
  None,
  Holo,
  Head,
  Face,
  Gloves,
  UpperBody,
  LowerBody,
  Boots,
  MeleeWeapon,
  Weapon1,
  Weapon2,
  Weapon3,
  QuickItem1,
  QuickItem2,
  QuickItem3,
  FunctionalItem1,
  FunctionalItem2,
  FunctionalItem3,
}

export enum LocaleType {
  en_US,
  ko_KR,
  tr_TR,
  fr_FR,
  it_IT,
  de_DE,
}

export enum QuickItemLogic {
  None,
  SpringGrenade,
  HealthPack,
  ArmorPack,
  AmmoPack,
  ExplosiveGrenade,
}

export enum TutorialStepType {
  MouseLook = 1,
  KeyboardMove,
  WalkToArmory,
  PickUpWeapon,
  ShootFirstGroup,
  ShootSecondGroup,
  TutorialComplete,
  NameSelection,
  TutorialStart,
}

export enum UberstrikeItemClass {
  WeaponMelee = 1,
  WeaponHandgun, // # LEGACY # //
  WeaponMachinegun = 3,
  WeaponShotgun,
  WeaponSniperRifle,
  WeaponCannon,
  WeaponSplattergun,
  WeaponLauncher,
  WeaponModScope,
  WeaponModMuzzle,
  WeaponModWeaponMod,
  GearBoots,
  GearHead,
  GearFace,
  GearUpperBody,
  GearLowerBody,
  GearGloves,
  QuickUseGeneral,
  QuickUseGrenade,
  QuickUseMine,
  FunctionalGeneral,
  SpecialGeneral,
  GearHolo,
}

export enum UberstrikeItemType {
  None,
  Weapon = 1,
  WeaponMod,
  Gear,
  QuickUse,
  Functional,
  Special,
}
