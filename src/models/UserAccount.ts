import { ChannelType } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { TutorialStepType } from '@festivaldev/uberstrike-js/UberStrike/Core/Types';
import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface UserAccountAttributes {
  Cmid?: number;
  EmailAddress?: string;
  Password?: string;
  Channel?: ChannelType;
  Locale?: string;
  TutorialStep?: TutorialStepType;
}

export default class UserAccount extends Model<UserAccountAttributes> {
  declare Cmid: number;
  declare EmailAddress: string;
  declare Password: string;
  declare Channel: ChannelType;
  declare Locale: string;
  declare TutorialStep: TutorialStepType;

  public static initialize(sequelize: Sequelize) {
    UserAccount.init(
      {
        Cmid: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        EmailAddress: DataTypes.STRING,
        Password: DataTypes.STRING,
        Channel: DataTypes.INTEGER,
        Locale: DataTypes.STRING,
        TutorialStep: DataTypes.INTEGER,
      },
      {
        sequelize,
        timestamps: false,
      },
    );
  }

  public static associate(_) {}
}
