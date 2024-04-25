import { DataTypes, Model, type Sequelize } from 'sequelize';

export interface PrivateMessageAttributes {
  PrivateMessageId?: number;
  FromCmid?: number;
  FromName?: string;
  ToCmid?: number;
  DateSent?: Date;
  ContentText?: string;
  IsRead?: boolean;
  HasAttachment?: boolean;
  IsDeletedBySender?: boolean;
  IsDeletedByReceiver?: boolean;
}

export default class PrivateMessage extends Model<PrivateMessageAttributes> {
  declare PrivateMessageId: number;
  declare FromCmid: number;
  declare FromName: string;
  declare ToCmid: number;
  declare DateSent: Date;
  declare ContentText: string;
  declare IsRead: boolean;
  declare HasAttachment: boolean;
  declare IsDeletedBySender: boolean;
  declare IsDeletedByReceiver: boolean;

  public static initialize(sequelize: Sequelize) {
    PrivateMessage.init(
      {
        PrivateMessageId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        FromCmid: DataTypes.INTEGER,
        FromName: DataTypes.STRING(18),
        ToCmid: DataTypes.INTEGER,
        DateSent: DataTypes.DATE,
        ContentText: DataTypes.TEXT,
        IsRead: DataTypes.BOOLEAN,
        HasAttachment: DataTypes.BOOLEAN,
        IsDeletedBySender: DataTypes.BOOLEAN,
        IsDeletedByReceiver: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        timestamps: false,
      },
    );
  }

  public static associate({ PublicProfile }) {
    PrivateMessage.belongsTo(PublicProfile, {
      foreignKey: 'FromCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    PrivateMessage.belongsTo(PublicProfile, {
      foreignKey: 'ToCmid',
      targetKey: 'Cmid',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
}
