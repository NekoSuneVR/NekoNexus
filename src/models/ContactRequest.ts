import { ContactRequestStatus } from '@festivaldev/uberstrike-js/Cmune/DataCenter/Common/Entities';
import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface ContactRequestAttributes {
  RequestId?: number;
  InitiatorCmid?: number;
  InitiatorName?: string;
  ReceiverCmid?: number;
  InitiatorMessage?: string;
  Status?: ContactRequestStatus;
  SentDate?: Date;
}

export default class ContactRequest extends Model<ContactRequestAttributes> {
  declare RequestId: number;
  declare InitiatorCmid: number;
  declare InitiatorName: string;
  declare ReceiverCmid: number;
  declare InitiatorMessage: string;
  declare Status: ContactRequestStatus;
  declare SentDate: Date;

  public static initialize(sequelize: Sequelize) {
    ContactRequest.init(
      {
        RequestId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        InitiatorCmid: DataTypes.INTEGER,
        InitiatorName: DataTypes.STRING(18),
        ReceiverCmid: DataTypes.INTEGER,
        InitiatorMessage: DataTypes.TEXT,
        Status: DataTypes.INTEGER,
        SentDate: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'ContactRequests',
        timestamps: false,
      },
    );
  }

  public static associate({ PublicProfile }: any) {
    ContactRequest.belongsTo(PublicProfile, {
      foreignKey: 'InitiatorCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    ContactRequest.belongsTo(PublicProfile, {
      foreignKey: 'ReceiverCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
