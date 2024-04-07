import { EmailAddressStatus, MemberAccessLevel } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import {
  DataTypes, Model, Op, Utils, type Sequelize,
} from 'sequelize';

export interface PublicProfileAttributes {
  Cmid?: number;
  Name?: string;
  IsChatDisabled?: boolean;
  AccessLevel?: MemberAccessLevel;
  GroupTag?: string | null;
  LastLoginDate?: Date;
  EmailAddressStatus?: EmailAddressStatus;
  FacebookId?: string;
}

export default class PublicProfile extends Model<PublicProfileAttributes> {
  declare Cmid: number;
  declare Name: string;
  declare IsChatDisabled: boolean;
  declare AccessLevel: MemberAccessLevel;
  declare GroupTag: string | null;
  declare LastLoginDate: Date;
  declare EmailAddressStatus: EmailAddressStatus;
  declare FacebookId: string;

  public static initialize(sequelize: Sequelize) {
    PublicProfile.init({
      Cmid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      Name: {
        type: DataTypes.STRING(18),
        // unique: true,
      },
      IsChatDisabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      AccessLevel: {
        type: DataTypes.INTEGER,
        defaultValue: MemberAccessLevel.Default,
      },
      GroupTag: DataTypes.STRING(5),
      LastLoginDate: DataTypes.DATE,
      EmailAddressStatus: DataTypes.INTEGER,
      FacebookId: DataTypes.STRING,
    }, {
      sequelize,
      timestamps: false,
    });
  }

  public static associate(_) {}

  static async getProfile(search: string): Promise<PublicProfile | null> {
    return PublicProfile.findOne({
      where: {
        Cmid: {
          [Op.gt]: 0,
        },
        [Op.or]: [
          {
            Name: {
              [Op.like]: `%${search.toLocaleLowerCase()}%`,
            },
          },
          new Utils.Where(new Utils.Col('Cmid'), 'LIKE', `%${search.toLocaleLowerCase()}%`),
        ],
      },
      order: [['Name', 'ASC']],
    });
  }

  static async getProfiles(search: string): Promise<any> {
    return PublicProfile.findAll({
      where: {
        Cmid: {
          [Op.gt]: 0,
        },
        [Op.or]: [
          {
            Name: {
              [Op.like]: `%${search.toLocaleLowerCase()}%`,
            },
          },
          new Utils.Where(new Utils.Col('Cmid'), 'LIKE', `%${search.toLocaleLowerCase()}%`),
        ],
      },
      order: [['Name', 'ASC']],
    });
  }
}
