import { ClanMember } from "@festivaldev/paradise-models";
import {
  GroupColor,
  GroupFontStyle,
} from "@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities";
import { DataTypes, Model, type Sequelize } from "sequelize";

export interface ClanAttributes {
  GroupId?: number;
  MembersCount?: number;
  Description?: string;
  Name?: string;
  Motto?: string;
  Address?: string;
  FoundingDate?: Date;
  Picture?: string;
  Type?: number;
  LastUpdated?: Date;
  Tag?: string;
  MembersLimit?: number;
  ColorStyle?: GroupColor;
  FontStyle?: GroupFontStyle;
  ApplicationId?: number;
  OwnerCmid?: number;
  OwnerName?: string;

  Members?: ClanMember[];
}

export default class Clan extends Model<ClanAttributes> {
  declare GroupId: number;
  declare MembersCount: number;
  declare Description: string;
  declare Name: string;
  declare Motto: string;
  declare Address: string;
  declare FoundingDate: Date;
  declare Picture: string;
  declare Type: number;
  declare LastUpdated: Date;
  declare Tag: string;
  declare MembersLimit: number;
  declare ColorStyle: GroupColor;
  declare FontStyle: GroupFontStyle;
  declare ApplicationId: number;
  declare OwnerCmid: number;
  declare OwnerName: string;

  declare Members: ClanMember[];

  public static initialize(sequelize: Sequelize) {
    Clan.init(
      {
        GroupId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        MembersCount: DataTypes.INTEGER,
        Description: DataTypes.TEXT,
        Name: {
          type: DataTypes.STRING(25),
          unique: true,
        },
        Motto: DataTypes.STRING(25),
        Address: DataTypes.STRING,
        FoundingDate: DataTypes.DATE,
        Picture: DataTypes.STRING,
        Type: DataTypes.INTEGER,
        LastUpdated: DataTypes.DATE,
        Tag: DataTypes.STRING(5),
        MembersLimit: DataTypes.INTEGER,
        ColorStyle: DataTypes.INTEGER,
        FontStyle: DataTypes.INTEGER,
        ApplicationId: DataTypes.INTEGER,
        OwnerCmid: DataTypes.INTEGER,
        OwnerName: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: "Clans",
        timestamps: false,
      }
    );
  }

  public static associate({ ClanMember, PublicProfile }: any) {
    Clan.hasMany(ClanMember, {
      as: "Members",
      foreignKey: "GroupId",
      sourceKey: "GroupId",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    Clan.belongsTo(PublicProfile, {
      foreignKey: "OwnerCmid",
      targetKey: "Cmid",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  }
}
