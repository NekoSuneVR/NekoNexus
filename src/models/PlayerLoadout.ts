import { UberstrikeInventoryItem } from '@/utils';
import { AvatarType } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';
import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface PlayerLoadoutAttributes {
  LoadoutId?: number;
  Backpack?: number;
  Boots?: UberstrikeInventoryItem;
  Cmid?: number;
  Face?: UberstrikeInventoryItem;
  FunctionalItem1?: UberstrikeInventoryItem;
  FunctionalItem2?: UberstrikeInventoryItem;
  FunctionalItem3?: UberstrikeInventoryItem;
  Gloves?: UberstrikeInventoryItem;
  Head?: UberstrikeInventoryItem;
  LowerBody?: UberstrikeInventoryItem;
  MeleeWeapon?: UberstrikeInventoryItem;
  QuickItem1?: UberstrikeInventoryItem;
  QuickItem2?: UberstrikeInventoryItem;
  QuickItem3?: UberstrikeInventoryItem;
  Type?: AvatarType;
  UpperBody?: UberstrikeInventoryItem;
  Weapon1?: UberstrikeInventoryItem;
  Weapon1Mod1?: UberstrikeInventoryItem;
  Weapon1Mod2?: UberstrikeInventoryItem;
  Weapon1Mod3?: UberstrikeInventoryItem;
  Weapon2?: UberstrikeInventoryItem;
  Weapon2Mod1?: UberstrikeInventoryItem;
  Weapon2Mod2?: UberstrikeInventoryItem;
  Weapon2Mod3?: UberstrikeInventoryItem;
  Weapon3?: UberstrikeInventoryItem;
  Weapon3Mod1?: UberstrikeInventoryItem;
  Weapon3Mod2?: UberstrikeInventoryItem;
  Weapon3Mod3?: UberstrikeInventoryItem;
  Webbing?: UberstrikeInventoryItem;
  SkinColor?: string;
}

export default class PlayerLoadout extends Model<PlayerLoadoutAttributes> {
  declare LoadoutId: number;
  declare Backpack: number;
  declare Boots: UberstrikeInventoryItem;
  declare Cmid: number;
  declare Face: UberstrikeInventoryItem;
  declare FunctionalItem1: UberstrikeInventoryItem;
  declare FunctionalItem2: UberstrikeInventoryItem;
  declare FunctionalItem3: UberstrikeInventoryItem;
  declare Gloves: UberstrikeInventoryItem;
  declare Head: UberstrikeInventoryItem;
  declare LowerBody: UberstrikeInventoryItem;
  declare MeleeWeapon: UberstrikeInventoryItem;
  declare QuickItem1: UberstrikeInventoryItem;
  declare QuickItem2: UberstrikeInventoryItem;
  declare QuickItem3: UberstrikeInventoryItem;
  declare Type: AvatarType;
  declare UpperBody: UberstrikeInventoryItem;
  declare Weapon1: UberstrikeInventoryItem;
  declare Weapon1Mod1: UberstrikeInventoryItem;
  declare Weapon1Mod2: UberstrikeInventoryItem;
  declare Weapon1Mod3: UberstrikeInventoryItem;
  declare Weapon2: UberstrikeInventoryItem;
  declare Weapon2Mod1: UberstrikeInventoryItem;
  declare Weapon2Mod2: UberstrikeInventoryItem;
  declare Weapon2Mod3: UberstrikeInventoryItem;
  declare Weapon3: UberstrikeInventoryItem;
  declare Weapon3Mod1: UberstrikeInventoryItem;
  declare Weapon3Mod2: UberstrikeInventoryItem;
  declare Weapon3Mod3: UberstrikeInventoryItem;
  declare Webbing: UberstrikeInventoryItem;
  declare SkinColor: string;

  public static initialize(sequelize: Sequelize) {
    PlayerLoadout.init(
      {
        LoadoutId: DataTypes.INTEGER,
        Backpack: DataTypes.INTEGER,
        Boots: DataTypes.INTEGER,
        Cmid: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Face: DataTypes.INTEGER,
        FunctionalItem1: DataTypes.INTEGER,
        FunctionalItem2: DataTypes.INTEGER,
        FunctionalItem3: DataTypes.INTEGER,
        Gloves: DataTypes.INTEGER,
        Head: DataTypes.INTEGER,
        LowerBody: DataTypes.INTEGER,
        MeleeWeapon: DataTypes.INTEGER,
        QuickItem1: DataTypes.INTEGER,
        QuickItem2: DataTypes.INTEGER,
        QuickItem3: DataTypes.INTEGER,
        Type: DataTypes.INTEGER,
        UpperBody: DataTypes.INTEGER,
        Weapon1: DataTypes.INTEGER,
        Weapon1Mod1: DataTypes.INTEGER,
        Weapon1Mod2: DataTypes.INTEGER,
        Weapon1Mod3: DataTypes.INTEGER,
        Weapon2: DataTypes.INTEGER,
        Weapon2Mod1: DataTypes.INTEGER,
        Weapon2Mod2: DataTypes.INTEGER,
        Weapon2Mod3: DataTypes.INTEGER,
        Weapon3: DataTypes.INTEGER,
        Weapon3Mod1: DataTypes.INTEGER,
        Weapon3Mod2: DataTypes.INTEGER,
        Weapon3Mod3: DataTypes.INTEGER,
        Webbing: DataTypes.INTEGER,
        SkinColor: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'PlayerLoadouts',
        timestamps: false,
      },
    );
  }

  public static associate({ PublicProfile }: any) {
    PlayerLoadout.belongsTo(PublicProfile, {
      foreignKey: 'Cmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
