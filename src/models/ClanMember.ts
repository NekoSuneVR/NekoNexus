import { GroupPosition } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface ClanMemberAttributes {
  GroupId?: number;
  Name?: string;
  Cmid?: number;
  Position?: GroupPosition;
  JoiningDate?: Date;
  Lastlogin?: Date;
}

export default class ClanMember extends Model<ClanMemberAttributes> {
  declare GroupId: number;
  declare Name: string;
  declare Cmid: number;
  declare Position: GroupPosition;
  declare JoiningDate: Date;
  declare Lastlogin: Date;

  public static initialize(sequelize: Sequelize) {
    ClanMember.init(
      {
        GroupId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Name: DataTypes.STRING(18),
        Cmid: {
          type: DataTypes.INTEGER,
          unique: true,
        },
        Position: DataTypes.INTEGER,
        JoiningDate: DataTypes.DATE,
        Lastlogin: DataTypes.DATE,
      },
      {
        sequelize,
        timestamps: false,
        defaultScope: {
          attributes: { exclude: ['GroupId'] },
        },
      },
    );
  }

  public static associate(_) {}
}
